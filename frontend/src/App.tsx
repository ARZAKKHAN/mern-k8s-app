import type React from "react";
import {
  Activity,
  Bell,
  Database,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Search,
  Server,
  Users,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

function App() {
  const stats = [
    { label: "Total Tasks", value: "128", change: "+12.5%", positive: true },
    { label: "Completed Today", value: "34", change: "+8.1%", positive: true },
    { label: "Pending", value: "17", change: "-3.4%", positive: false },
    { label: "Active Users", value: "23", change: "+2.0%", positive: true },
  ];

  const recentTasks = [
    {
      title: "Fix backend health check",
      project: "MERN API",
      status: "In Progress",
      priority: "High",
    },
    {
      title: "Add dashboard charts",
      project: "Frontend UI",
      status: "Todo",
      priority: "Medium",
    },
    {
      title: "Configure ArgoCD sync",
      project: "DevOps",
      status: "Done",
      priority: "High",
    },
    {
      title: "Refactor MongoDB models",
      project: "Database",
      status: "In Review",
      priority: "Low",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-2 p-4 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-sm font-bold">
            KT
          </div>
          <div>
            <div className="text-sm font-semibold">Kube Taskboard</div>
            <div className="text-xs text-slate-400">MERN + K8s + ArgoCD</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={ListTodo} label="Tasks" />
          <SidebarItem icon={Database} label="MongoDB" />
          <SidebarItem icon={Server} label="Deployments" />
          <SidebarItem icon={Activity} label="Metrics" />
          <SidebarItem icon={Users} label="Team" />
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Logged in as <span className="text-slate-200 font-medium">devops</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 bg-slate-950/80 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="outline" size="icon" className="border-slate-700">
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">Kube Taskboard</span>
          </div>

          <div className="hidden md:flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Overview</span>
            <span className="text-sm font-semibold">MERN Kubernetes Dashboard</span>
          </div>

          <div className="flex-1 flex items-center gap-2 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search tasks, deployments, pods..."
                className="pl-8 bg-slate-900 border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-slate-700">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-700">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
          {/* KPI Cards */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.label} className="bg-slate-900/60 border-slate-800 shadow-sm">
                <CardHeader className="pb-2 border-b-0">
                  <CardTitle className="text-xs font-medium text-slate-400">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between pt-0">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div
                    className={`text-xs font-medium ${
                      item.positive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {item.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Middle: Chart + Info */}
          <section className="grid gap-4 lg:grid-cols-3">
            {/* Chart placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">Tasks Activity (Mock Chart)</CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  Coming soon
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="h-40 rounded-lg border border-dashed border-slate-700 bg-slate-950/40 flex items-center justify-center text-xs text-slate-500">
                  Chart area – yahan baad mein real chart library (Recharts / Chart.js) integrate kar sakte ho.
                </div>
              </CardContent>
            </Card>

            {/* Cluster status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Cluster Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <StatusPill label="MicroK8s" value="Running" color="emerald" />
                <StatusPill label="ArgoCD" value="Synced" color="emerald" />
                <StatusPill label="MongoDB" value="Connected" color="emerald" />
                <StatusPill label="Ingress" value="Configured" color="sky" />
              </CardContent>
            </Card>
          </section>

          {/* Recent tasks table */}
          <section className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  {recentTasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                    >
                      <div>
                        <div className="font-medium text-slate-100">{task.title}</div>
                        <div className="text-[11px] text-slate-400">{task.project}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{task.status}</Badge>
                        <Badge
                          className={
                            task.priority === "High"
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : task.priority === "Medium"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-slate-700/40 text-slate-200 border-slate-500/40"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <Button className="w-full justify-start">Create New Task</Button>
                <Button variant="outline" className="w-full justify-start">
                  View All Deployments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Open ArgoCD
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Cluster Logs
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}

type StatusPillProps = {
  label: string;
  value: string;
  color?: "emerald" | "sky";
};

function StatusPill({ label, value, color = "emerald" }: StatusPillProps) {
  const colorClasses =
    color === "emerald"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
      : "bg-sky-500/15 text-sky-300 border-sky-500/40";

  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className={`text-[11px] px-2 py-1 rounded-full border ${colorClasses}`}>
        {value}
      </span>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;
};

function SidebarItem({ icon: Icon, label, active }: SidebarItemProps) {
  return (
    <button
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
        active
          ? "bg-slate-800 text-slate-50"
          : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export default App;
