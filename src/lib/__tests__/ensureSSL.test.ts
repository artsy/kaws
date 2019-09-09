import { ensureSSL } from "../ensureSSL"

describe("Ensure SSL middleware", () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = { params: {}, logout: jest.fn(), url: "/terms" }
    res = { redirect: jest.fn() }
    next = jest.fn()
  })

  it("redirects normal http requests to https", () => {
    req.protocol = "http:"

    ensureSSL(req, res, next)
    expect(res.redirect.mock.calls[0]).toEqual([
      301,
      "https://foobar.com/terms",
    ])
  })

  it("does not redirect https protocols", () => {
    req.protocol = "https:"

    ensureSSL(req, res, next)
    expect(res.redirect).not.toBeCalled()
    expect(next).toBeCalled()
  })
})
