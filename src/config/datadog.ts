import * as ddTracer from "dd-trace"
const { DD_APM_ENABLED, DD_TRACE_AGENT_HOSTNAME } = process.env

export const setupDataDog = () => {
  if (DD_APM_ENABLED) {
    ddTracer.init({
      hostname: DD_TRACE_AGENT_HOSTNAME,
      service: "kaws",
      plugins: false,
      // TODO: figure out how to get the debugger working
      // debug: true,
      // logger: {
      //   debug: console.log,
      //   error: console.error,
      // },
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
