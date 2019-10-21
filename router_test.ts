import { test } from "https://deno.land/std/testing/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Router } from './router.ts'

test(function parseValidUrl(): void {
  let router = new Router();
  let parsed = router.parseUrl('https://test.url/path-1/path2');

  assertEquals(parsed.pathname, '/path-1/path2')
})

test(function registerHandler(): void {
  let router = new Router();
  router.add('GET', '/test', (context, pathname, request) => console.log({context, pathname, request}))
  let filtered = router.routes.filter(route => route.url === '/test');

  assertEquals(filtered.length, 1)
})

test(function resolveHandler(): void {
  let router = new Router();
  let EXPECTED = 'correct'
  router.add('GET', '/test', (context, pathname, request) => EXPECTED)

  let resolvedOutput = router.resolve({app: 'fake'}, {method: 'GET', url: 'https://test.url/test'})

  assertEquals(resolvedOutput, EXPECTED)
})