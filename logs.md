Error [AI_APICallError]: You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
_ Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image
_ Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image
_ Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.5-flash-preview-image
Please retry in 16.34553186s.
at async generateCoverImage (app/actions.ts:166:20)
164 |
165 | try { > 166 | const result = await generateText({
| ^
167 | model: google("gemini-2.5-flash-image", {
168 | responseModalities: ["IMAGE"],
169 | }), {
cause: undefined,
url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
requestBodyValues: [Object],
statusCode: 429,
responseHeaders: [Object],
responseBody: '{\n' +
' "error": {\n' +
' "code": 429,\n' +
' "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \\n_ Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image\\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image\\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.5-flash-preview-image\\nPlease retry in 16.34553186s.",\n' +
' "status": "RESOURCE_EXHAUSTED",\n' +
' "details": [\n' +
' {\n' +
' "@type": "type.googleapis.com/google.rpc.Help",\n' +
' "links": [\n' +
' {\n' +
' "description": "Learn more about Gemini API quotas",\n' +
' "url": "https://ai.google.dev/gemini-api/docs/rate-limits"\n' +
' }\n' +
' ]\n' +
' },\n' +
' {\n' +
' "@type": "type.googleapis.com/google.rpc.QuotaFailure",\n' +
' "violations": [\n' +
' {\n' +
' "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",\n' +
' "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",\n' +
' "quotaDimensions": {\n' +
' "location": "global",\n' +
' "model": "gemini-2.5-flash-preview-image"\n' +
' }\n' +
' },\n' +
' {\n' +
' "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",\n' +
' "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",\n' +
' "quotaDimensions": {\n' +
' "location": "global",\n' +
' "model": "gemini-2.5-flash-preview-image"\n' +
' }\n' +
' },\n' +
' {\n' +
' "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",\n' +
' "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",\n' +
' "quotaDimensions": {\n' +
' "location": "global",\n' +
' "model": "gemini-2.5-flash-preview-image"\n' +
' }\n' +
' }\n' +
' ]\n' +
' },\n' +
' {\n' +
' "@type": "type.googleapis.com/google.rpc.RetryInfo",\n' +
' "retryDelay": "16s"\n' +
' }\n' +
' ]\n' +
' }\n' +
'}\n',
isRetryable: true,
data: [Object]
}
],
lastError: Error [AI_APICallError]: You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.

- Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image
- Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image
- Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.5-flash-preview-image
  Please retry in 16.34553186s.
  at async generateCoverImage (app/actions.ts:166:20)
  164 |
  165 | try {
  > 166 | const result = await generateText({
          |                    ^
      167 |       model: google("gemini-2.5-flash-image", {
      168 |         responseModalities: ["IMAGE"],
      169 |       }), {
      cause: undefined,
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      requestBodyValues: {
        generationConfig: [Object],
        contents: [Array],
        systemInstruction: undefined,
        safetySettings: undefined,
        tools: undefined,
        toolConfig: undefined,
        cachedContent: undefined,
        labels: undefined,
        serviceTier: undefined
      },
      statusCode: 429,
      responseHeaders: {
        'alt-svc': 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
        'content-encoding': 'gzip',
        'content-type': 'application/json; charset=UTF-8',
        date: 'Fri, 17 Apr 2026 22:19:43 GMT',
        server: 'scaffolding on HTTPServer2',
        'server-timing': 'gfet4t7; dur=89',
        'transfer-encoding': 'chunked',
        vary: 'Origin, X-Origin, Referer',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
        'x-gemini-service-tier': 'standard',
        'x-xss-protection': '0'
      },
      responseBody: '{\n' +
        '  "error": {\n' +
        '    "code": 429,\n' +
        '    "message": "You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit. \\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image\\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-2.5-flash-preview-image\\n* Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_input_token_count, limit: 0, model: gemini-2.5-flash-preview-image\\nPlease retry in 16.34553186s.",\n' +
        '    "status": "RESOURCE_EXHAUSTED",\n' +
        '    "details": [\n' +
        '      {\n' +
        '        "@type": "type.googleapis.com/google.rpc.Help",\n' +
        '        "links": [\n' +
        '          {\n' +
        '            "description": "Learn more about Gemini API quotas",\n' +
        '            "url": "https://ai.google.dev/gemini-api/docs/rate-limits"\n' +
        '          }\n' +
        '        ]\n' +
        '      },\n' +
        '      {\n' +
        '        "@type": "type.googleapis.com/google.rpc.QuotaFailure",\n' +
        '        "violations": [\n' +
        '          {\n' +
        '            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",\n' +
        '            "quotaId": "GenerateRequestsPerDayPerProjectPerModel-FreeTier",\n' +
        '            "quotaDimensions": {\n' +
        '              "location": "global",\n' +
        '              "model": "gemini-2.5-flash-preview-image"\n' +
        '            }\n' +
        '          },\n' +
        '          {\n' +
        '            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_requests",\n' +
        '            "quotaId": "GenerateRequestsPerMinutePerProjectPerModel-FreeTier",\n' +
        '            "quotaDimensions": {\n' +
        '              "location": "global",\n' +
        '              "model": "gemini-2.5-flash-preview-image"\n' +
        '            }\n' +
        '          },\n' +
        '          {\n' +
        '            "quotaMetric": "generativelanguage.googleapis.com/generate_content_free_tier_input_token_count",\n' +
        '            "quotaId": "GenerateContentInputTokensPerModelPerMinute-FreeTier",\n' +
        '            "quotaDimensions": {\n' +
        '              "location": "global",\n' +
        '              "model": "gemini-2.5-flash-preview-image"\n' +
        '            }\n' +
        '          }\n' +
        '        ]\n' +
        '      },\n' +
        '      {\n' +
        '        "@type": "type.googleapis.com/google.rpc.RetryInfo",\n' +
        '        "retryDelay": "16s"\n' +
        '      }\n' +
        '    ]\n' +
        '  }\n' +
        '}\n',
      isRetryable: true,
      data: { error: [Object] }
  }
  }
  ⨯ Error: Failed to generate image. Please try again or upload manually.
  at generateCoverImage (app/actions.ts:209:11)
  207 | ? "Image generation quota exceeded. Please try again later or upload manually."
  208 | : "Failed to generate image. Please try again or upload manually.";
  > 209 | throw new Error(message);
        |           ^
  210 | }
  211 | }
  212 | {
  digest: '1793748046'
  }
  POST /decks/cmo2dsrbz002n04l165d6su0x/edit 500 in 8.0s (next.js: 7ms, proxy.ts: 5ms, application-code: 8.0s)
  └─ ƒ generateCoverImage("Web Search Engines", "Covers the history and mechanics of Google's search engine, the PageRank algorithm, Google Trends, normalized data, and how search query data can be used to study societal and cultural phenomena — including the Michel et al. (2011) culturomics research.") in 7698ms app/actions.ts
