/**
 * VibeBackgroundGlow — Modern SaaS gradient mesh background.
 * Pure CSS, zero performance impact.
 * Place inside a `relative` parent, renders at -z-10.
 */
export function VibeBackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Left glow: fuchsia/pink — warm accent */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: "rgba(232, 160, 232, 0.4)" }}
      />
      {/* Right glow: violet/indigo — cool accent */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[130px]"
        style={{ background: "rgba(183, 160, 232, 0.35)" }}
      />
      {/* Center glow: soft pink — halos behind the H1 */}
      <div
        className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-[100%] blur-[150px]"
        style={{ background: "rgba(245, 200, 210, 0.3)" }}
      />
    </div>
  );
}
