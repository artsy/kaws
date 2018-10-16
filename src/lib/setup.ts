import ddTracer from "dd-trace"

export const setupDataDog = () => {
  if (process.env.DD_APM_ENABLED) {
    ddTracer.init({
      hostname: process.env.DD_TRACE_AGENT_HOSTNAME,
      service: "kaws",
      plugins: false,
    })
    ddTracer.use("express", {
      service: "kaws",
      headers: ["User-Agent"],
    })
    ddTracer.use("graphql", {
      service: "kaws.graphql",
    })
    ddTracer.use("http", {
      service: `kaws.http-client`,
    })
  }
}
