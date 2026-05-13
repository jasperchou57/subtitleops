export function GET() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" rx="3" fill="#18181b"/>
  <rect x="3" y="9" width="10" height="2" rx="1" fill="#fafafa"/>
  <rect x="3" y="12" width="6" height="2" rx="1" fill="#fafafa"/>
</svg>`,
    {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
