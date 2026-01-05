import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookshelf API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      width: 100%;
      background: #242424;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid #333;
    }
    h1 {
      color: #646cff;
      font-size: 2.5rem;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .version {
      color: #a0a0a0;
      font-size: 0.9rem;
      margin-bottom: 30px;
    }
    .status {
      display: inline-block;
      background: #2a5a2a;
      color: #4ade80;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #e0e0e0;
      font-size: 1.2rem;
      margin-bottom: 15px;
      border-bottom: 2px solid #333;
      padding-bottom: 8px;
    }
    .endpoint {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;
    }
    .endpoint:hover {
      border-color: #646cff;
      background: #2a2a2a;
    }
    .method {
      background: #646cff;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 12px;
      min-width: 60px;
      text-align: center;
    }
    .path {
      color: #e0e0e0;
      font-family: 'Courier New', monospace;
      flex: 1;
    }
    .link {
      color: #646cff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .link:hover {
      color: #747bff;
      text-decoration: underline;
    }
    .info {
      background: #1a1a1a;
      border-left: 4px solid #646cff;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    .info p {
      color: #a0a0a0;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #333;
      color: #888;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📚 Bookshelf API</h1>
    <div class="version">Version 1.0.0</div>
    <div class="status">● Running</div>

    <div class="section">
      <div class="section-title">Available Endpoints</div>
      <div class="endpoint">
        <span class="method">GET</span>
        <span class="path">/graphql</span>
        <a href="/graphql" class="link" target="_blank">Open GraphQL Playground →</a>
      </div>
      <div class="endpoint">
        <span class="method">POST</span>
        <span class="path">/graphql</span>
        <span class="link">GraphQL API Endpoint</span>
      </div>
    </div>

    <div class="info">
      <p><strong>🔐 Authentication Required</strong></p>
      <p>All GraphQL endpoints require authentication via Auth0. Include your JWT access token in the Authorization header:</p>
      <p style="margin-top: 8px; font-family: 'Courier New', monospace; color: #646cff;">
        Authorization: Bearer &lt;your-token&gt;
      </p>
    </div>

    <div class="footer">
      Built with NestJS, GraphQL, and TypeORM
    </div>
  </div>
</body>
</html>
    `;
  }
}
