import {
  apiGroups,
  architectureDiagram,
  componentGenerationFlow,
  databaseEntities,
  designModules,
  folderStructure,
  mainRoles,
  scalabilityNotes,
  securityNotes,
  stackLayers,
} from "@/lib/platform-architecture";

export default function Home() {
  const moduleGroups = [
    {
      title: "Core platform services",
      items: designModules.slice(0, 6),
    },
    {
      title: "Generation and governance",
      items: designModules.slice(6),
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-faint opacity-30" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-5 py-8 md:px-8 lg:px-12">
        <header className="glass-panel sticky top-4 z-20 rounded-3xl px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">
                SaaS UI Component Customization Platform
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance text-white md:text-4xl">
                A branded UI kit workspace for multi-tenant design systems.
              </h1>
            </div>
            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <Stat label="Tenancy model" value="Company-first" />
              <Stat label="Code targets" value="React / Next.js / Tailwind" />
              <Stat label="Delivery" value="Preview + export pipeline" />
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel rounded-[2rem] p-7 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-300/80">
              System overview
            </p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Companies use the platform to turn brand rules, design tokens, and reusable component
              templates into a private UI library. The playground updates in real time, versions
              the resulting UI kit, and exports production-ready frontend code for downstream apps.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Workspace isolation", "Each company owns its own brand and component data"],
                ["Visual editing", "Customize components through an interactive playground"],
                ["Version control", "Snapshot UI kits before release or export"],
                ["Code generation", "Emit framework-specific source from the same source of truth"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="glass-panel rounded-[2rem] p-7 md:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-300/80">
              Main user roles
            </p>
            <div className="mt-6 space-y-4">
              {mainRoles.map((role) => (
                <div key={role.name} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-white">{role.name}</h2>
                    <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
                      {role.scope}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{role.description}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {moduleGroups.map((group) => (
            <div key={group.title} className="glass-panel rounded-[2rem] p-7 md:p-8">
              <h2 className="text-xl font-semibold text-white">{group.title}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {group.items.map((module) => (
                  <article key={module.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-sky-200">{module.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{module.purpose}</p>
                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <p>{module.responsibilities}</p>
                      <p className="font-mono text-xs leading-5 text-slate-400">{module.data}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <DiagramPanel title="High-level architecture diagram" diagram={architectureDiagram} />
          <DiagramPanel title="Main user flow" diagram={componentGenerationFlow} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
          <DataPanel title="Recommended technology stack" items={stackLayers} />
          <DataPanel title="Database entity design" items={databaseEntities} />
          <DataPanel title="API surface" items={apiGroups} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <DataPanel title="Security architecture" items={securityNotes} />
          <DataPanel title="Scalability architecture" items={scalabilityNotes} />
        </section>

        <section className="glass-panel rounded-[2rem] p-7 md:p-8">
          <h2 className="text-xl font-semibold text-white">Folder structure</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {folderStructure.map((item) => (
              <div key={item.path} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <p className="font-mono text-sm text-sky-200">{item.path}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function DiagramPanel({ title, diagram }: { title: string; diagram: string }) {
  return (
    <section className="glass-panel rounded-[2rem] p-7 md:p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <pre className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-xs leading-6 text-slate-300">
        {diagram}
      </pre>
    </section>
  );
}

function DataPanel({
  title,
  items,
}: {
  title: string;
  items: Array<{ name: string; detail: string }>;
}) {
  return (
    <section className="glass-panel rounded-[2rem] p-7 md:p-8">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-sky-200">{item.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
