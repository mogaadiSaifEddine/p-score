// app/api/[...proxy]/route.ts
// Dynamic proxy route that handles all the endpoints from your Angular config

import { NextRequest, NextResponse } from 'next/server';

// Proxy configuration matching your Angular setup
const PROXY_CONFIG = [
  {
    context: [
      "/creator_server/signup/",
      "/creator_server/js_action/",
      "/content_manager/get_content_dict/",
      "/api",
      "/apis/",
      "/apis",
      "/creator_server/import_tour",
      "/creator_server/export_tour",
      "/creator_server/download_exported_tour",
      "/content_manager/save_localized_content/",
      "/content_manager/create_new_content/",
      "/content_manager/apis/",
      "/creator_server/apis",
      "/creator_server/get_thumb",
      "/creator_server/map_marker_category",
      "/creator_server/apis/bq",
      "/media_manager/api/update_field/",
      "/media_manager/api/",
      "/game/apis/",
      "/apis/observer/",
      "/apis/app/",
      "/observer/",
      "/store/",
      "/ws/",
      "/content_manager/preview/",
      "/creator_server/preview_tour/",
    ],
    target: "https://cms.locatify.com",
    secure: true,
    changeOrigin: true,
  },
  {
    context: ["/wp-json"],
    target: "https://locatify.com",
    secure: true,
    changeOrigin: true,
  },
  {
    context: ["/sdk/identify"],
    target: "https://user.userguiding.com",
    secure: true,
    changeOrigin: true,
  },
  {
    context: ["/m7c4pg57w"],
    target: "https://ik.imagekit.io",
    secure: true,
    changeOrigin: true,
  },
  {
    context: ["/prices"],
    target: "https://checkout.paddle.com",
    secure: true,
    changeOrigin: true,
  },
  {
    context: ["/json.gp"],
    target: "http://www.geoplugin.net",
    secure: true,
    changeOrigin: true,
  }
];

function findProxyConfig(path: string) {
  for (const config of PROXY_CONFIG) {
    for (const context of config.context) {
      if (path.startsWith(context)) {
        return config;
      }
    }
  }
  return null;
}

export async function GET(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleProxy(request, 'GET', params.proxy);
}

export async function POST(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleProxy(request, 'POST', params.proxy);
}

export async function PUT(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleProxy(request, 'PUT', params.proxy);
}

export async function DELETE(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleProxy(request, 'DELETE', params.proxy);
}

export async function PATCH(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  return handleProxy(request, 'PATCH', params.proxy);
}

async function handleProxy(request: NextRequest, method: string, pathSegments: string[]) {
  try {
    // Reconstruct the original path
    const originalPath = '/' + pathSegments.join('/');
    const { searchParams } = new URL(request.url);
    
    // Add query parameters if they exist
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${originalPath}?${queryString}` : originalPath;

    console.log(`Proxying ${method} request for path: ${fullPath}`);

    // Find matching proxy configuration
    const proxyConfig = findProxyConfig(originalPath);
    if (!proxyConfig) {
      return NextResponse.json(
        { error: `No proxy configuration found for path: ${originalPath}` },
        { status: 404 }
      );
    }

    // Build target URL
    const targetUrl = `${proxyConfig.target}${fullPath}`;
    console.log(`Target URL: ${targetUrl}`);

    // Prepare headers
    const proxyHeaders: Record<string, string> = {};

    // Copy relevant headers from the original request
    const headersToForward = [
      'authorization',
      'content-type',
      'accept',
      'user-agent',
      'accept-language',
      'accept-encoding',
      'cache-control',
      'x-requested-with',
      'x-csrf-token'
    ];

    headersToForward.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        proxyHeaders[headerName] = value;
      }
    });

    // Add referer header for cms.locatify.com requests (like in Angular config)
    if (proxyConfig.target.includes('cms.locatify.com')) {
      proxyHeaders['referer'] = 'https://cms.locatify.com/';
    }

    // Set origin if changeOrigin is true
    if (proxyConfig.changeOrigin) {
      const targetOrigin = new URL(proxyConfig.target).origin;
      proxyHeaders['origin'] = targetOrigin;
    }

    // Get request body for POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    // Make the proxied request
    const response = await fetch(targetUrl, {
      method,
      headers: proxyHeaders,
      body,
    });

    // Get response headers
    const responseHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
    };

    // Forward some response headers
    const headersToReturn = ['content-type', 'cache-control', 'etag', 'last-modified'];
    headersToReturn.forEach(headerName => {
      const value = response.headers.get(headerName);
      if (value) {
        responseHeaders[headerName] = value;
      }
    });

    // Get response body
    const responseBody = await response.arrayBuffer();

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Proxy request failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        path: '/' + pathSegments.join('/')
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}