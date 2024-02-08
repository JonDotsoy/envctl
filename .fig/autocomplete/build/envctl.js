var U = Object.create;
var W = Object.defineProperty;
var Y = Object.getOwnPropertyDescriptor;
var ee = Object.getOwnPropertyNames;
var te = Object.getPrototypeOf,
  ne = Object.prototype.hasOwnProperty;
var j = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var re = (e, t, n, r) => {
  if ((t && typeof t == "object") || typeof t == "function")
    for (let i of ee(t))
      !ne.call(e, i) &&
        i !== n &&
        W(e, i, {
          get: () => t[i],
          enumerable: !(r = Y(t, i)) || r.enumerable,
        });
  return e;
};
var ie = (e, t, n) => (
  (n = e != null ? U(te(e)) : {}),
  re(
    t || !e || !e.__esModule
      ? W(n, "default", { value: e, enumerable: !0 })
      : n,
    e
  )
);
var R = j((I) => {
  "use strict";
  Object.defineProperty(I, "__esModule", { value: !0 });
  I.shellExpand = I.ensureTrailingSlash = void 0;
  var se = (e) => (e.endsWith("/") ? e : `${e}/`);
  I.ensureTrailingSlash = se;
  var oe = (e, t) =>
      e.startsWith("~") && (e.length === 1 || e.charAt(1) === "/")
        ? e.replace("~", t)
        : e,
    le = (e, t) =>
      e
        .replace(/\$([A-Za-z0-9_]+)/g, (i) => {
          var s;
          let l = i.slice(1);
          return (s = t[l]) !== null && s !== void 0 ? s : i;
        })
        .replace(/\$\{([A-Za-z0-9_]+)(?::-([^}]+))?\}/g, (i, s, l) => {
          var c, a;
          return (a = (c = t[s]) !== null && c !== void 0 ? c : l) !== null &&
            a !== void 0
            ? a
            : i;
        }),
    ue = (e, t) => {
      var n;
      let { environmentVariables: r } = t;
      return le(oe(e, (n = r?.HOME) !== null && n !== void 0 ? n : "~"), r);
    };
  I.shellExpand = ue;
});
var z = j((g) => {
  "use strict";
  var ce =
    (g && g.__awaiter) ||
    function (e, t, n, r) {
      function i(s) {
        return s instanceof n
          ? s
          : new n(function (l) {
              l(s);
            });
      }
      return new (n || (n = Promise))(function (s, l) {
        function c(o) {
          try {
            u(r.next(o));
          } catch (f) {
            l(f);
          }
        }
        function a(o) {
          try {
            u(r.throw(o));
          } catch (f) {
            l(f);
          }
        }
        function u(o) {
          o.done ? s(o.value) : i(o.value).then(c, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    };
  Object.defineProperty(g, "__esModule", { value: !0 });
  g.filepaths =
    g.folders =
    g.getCurrentInsertedDirectory =
    g.sortFilesAlphabetically =
      void 0;
  var C = R();
  function $(e, t = []) {
    let n = t.map((i) => i.toLowerCase()),
      r = e.filter((i) => !n.includes(i.toLowerCase()));
    return [
      ...r.filter((i) => !i.startsWith(".")).sort((i, s) => i.localeCompare(s)),
      ...r.filter((i) => i.startsWith(".")).sort((i, s) => i.localeCompare(s)),
      "../",
    ];
  }
  g.sortFilesAlphabetically = $;
  var ae = (e, t, n) => {
    if (e === null) return "/";
    let r = (0, C.shellExpand)(t, n),
      i = r.slice(0, r.lastIndexOf("/") + 1);
    return i === ""
      ? (0, C.ensureTrailingSlash)(e)
      : i.startsWith("/")
        ? i
        : `${(0, C.ensureTrailingSlash)(e)}${i}`;
  };
  g.getCurrentInsertedDirectory = ae;
  function L(e = {}) {
    let {
        extensions: t = [],
        equals: n = [],
        matches: r,
        filterFolders: i = !1,
        editFileSuggestions: s,
        editFolderSuggestions: l,
        rootDirectory: c,
        showFolders: a = "always",
      } = e,
      u = new Set(t),
      o = new Set(n),
      f = () => t.length > 0 || n.length > 0 || r,
      y = (h = []) =>
        f()
          ? h.filter(({ name: p = "", type: O }) => {
              if ((!i && O === "folder") || o.has(p) || (r && p.match(r)))
                return !0;
              let [, ...d] = p.split(".");
              if (d.length >= 1) {
                let m = d.length - 1,
                  b = d[m];
                do {
                  if (u.has(b)) return !0;
                  (m -= 1), (b = [d[m], b].join("."));
                } while (m >= 0);
              }
              return !1;
            })
          : h,
      S = (h = []) =>
        !s && !l
          ? h
          : h.map((p) =>
              Object.assign(
                Object.assign({}, p),
                (p.type === "file" ? s : l) || {}
              )
            );
    return {
      trigger: (h, p) => {
        let O = h.lastIndexOf("/"),
          d = p.lastIndexOf("/");
        return O !== d
          ? !0
          : O === -1 && d === -1
            ? !1
            : h.slice(0, O) !== p.slice(0, d);
      },
      getQueryTerm: (h) => h.slice(h.lastIndexOf("/") + 1),
      custom: (h, p, O) =>
        ce(this, void 0, void 0, function* () {
          var d;
          let { isDangerous: m, currentWorkingDirectory: b, searchTerm: v } = O,
            w =
              (d = (0, g.getCurrentInsertedDirectory)(c ?? b, v, O)) !== null &&
              d !== void 0
                ? d
                : "/";
          try {
            let N = yield p({ command: "ls", args: ["-1ApL"], cwd: w }),
              Z = $(
                N.stdout.split(`
`),
                [".DS_Store"]
              ),
              P = [];
            for (let V of Z)
              if (V) {
                let F = V.endsWith("/") ? "folders" : "filepaths";
                ((F === "filepaths" && a !== "only") ||
                  (F === "folders" && a !== "never")) &&
                  P.push({
                    type: F === "filepaths" ? "file" : "folder",
                    name: V,
                    insertValue: V,
                    isDangerous: m,
                    context: { templateType: F },
                  });
              }
            return S(y(P));
          } catch {
            return [];
          }
        }),
    };
  }
  g.folders = Object.assign(
    () => L({ showFolders: "only" }),
    Object.freeze(L({ showFolders: "only" }))
  );
  g.filepaths = Object.assign(L, Object.freeze(L()));
});
var H = j((x) => {
  "use strict";
  var A =
    (x && x.__awaiter) ||
    function (e, t, n, r) {
      function i(s) {
        return s instanceof n
          ? s
          : new n(function (l) {
              l(s);
            });
      }
      return new (n || (n = Promise))(function (s, l) {
        function c(o) {
          try {
            u(r.next(o));
          } catch (f) {
            l(f);
          }
        }
        function a(o) {
          try {
            u(r.throw(o));
          } catch (f) {
            l(f);
          }
        }
        function u(o) {
          o.done ? s(o.value) : i(o.value).then(c, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    };
  Object.defineProperty(x, "__esModule", { value: !0 });
  x.keyValueList = x.keyValue = x.valueList = void 0;
  var K = new Map();
  function D(e, t) {
    return e.length === 0
      ? t
      : t.map((n) =>
          n.insertValue
            ? n
            : Object.assign(Object.assign({}, n), { insertValue: n.name + e })
        );
  }
  function J(e, t, n) {
    return A(this, void 0, void 0, function* () {
      if (typeof e == "function") {
        let r = yield e(...n);
        return D(t, r);
      }
      if (typeof e[0] == "string") {
        let r = e.map((i) => ({ name: i }));
        return D(t, r);
      }
      return D(t, e);
    });
  }
  function q(e, t, n, r) {
    return A(this, void 0, void 0, function* () {
      if (n || Array.isArray(e)) {
        let i = K.get(e);
        return i === void 0 && ((i = yield J(e, t, r)), K.set(e, i)), i;
      }
      return J(e, t, r);
    });
  }
  function Q(e, t) {
    return typeof t == "string"
      ? (e && t === "keys") || (!e && t === "values")
      : t;
  }
  function M(e, ...t) {
    return Math.max(...t.map((n) => e.lastIndexOf(n)));
  }
  function E(e, t) {
    let n = new Set(e);
    return t.filter((r) => {
      var i;
      return typeof r.name == "string"
        ? !n.has(r.name)
        : !(
            !((i = r.name) === null || i === void 0) && i.some((s) => n.has(s))
          );
    });
  }
  function fe({
    delimiter: e = ",",
    values: t = [],
    cache: n = !1,
    insertDelimiter: r = !1,
    allowRepeatedValues: i = !1,
  }) {
    return {
      trigger: (s, l) => s.lastIndexOf(e) !== l.lastIndexOf(e),
      getQueryTerm: (s) => s.slice(s.lastIndexOf(e) + e.length),
      custom: (...s) =>
        A(this, void 0, void 0, function* () {
          var l;
          let c = yield q(t, r ? e : "", n, s);
          if (i) return c;
          let [a] = s,
            u =
              (l = a[a.length - 1]) === null || l === void 0
                ? void 0
                : l.split(e);
          return E(u, c);
        }),
    };
  }
  x.valueList = fe;
  function de({
    separator: e = "=",
    keys: t = [],
    values: n = [],
    cache: r = !1,
    insertSeparator: i = !0,
  }) {
    return {
      trigger: (s, l) => s.indexOf(e) !== l.indexOf(e),
      getQueryTerm: (s) => s.slice(s.indexOf(e) + 1),
      custom: (...s) =>
        A(this, void 0, void 0, function* () {
          let [l] = s,
            a = !l[l.length - 1].includes(e),
            u = a ? t : n,
            o = Q(a, r);
          return q(u, a && i ? e : "", o, s);
        }),
    };
  }
  x.keyValue = de;
  function he({
    separator: e = "=",
    delimiter: t = ",",
    keys: n = [],
    values: r = [],
    cache: i = !1,
    insertSeparator: s = !0,
    insertDelimiter: l = !1,
    allowRepeatedKeys: c = !1,
    allowRepeatedValues: a = !0,
  }) {
    return {
      trigger: (u, o) => {
        let f = M(u, e, t),
          y = M(o, e, t);
        return f !== y;
      },
      getQueryTerm: (u) => {
        let o = M(u, e, t);
        return u.slice(o + 1);
      },
      custom: (...u) =>
        A(this, void 0, void 0, function* () {
          let [o] = u,
            f = o[o.length - 1],
            y = M(f, e, t),
            S = y === -1 || f.slice(y, y + e.length) !== e,
            h = S ? n : r,
            p = Q(S, i),
            d = yield q(h, S ? (s ? e : "") : l ? t : "", p, u);
          if (S) {
            if (c) return d;
            let b = f.split(t).map((v) => v.slice(0, v.indexOf(e)));
            return E(b, d);
          }
          if (a) return d;
          let m = f.split(t).map((b) => b.slice(b.indexOf(e) + e.length));
          return E(m, d);
        }),
    };
  }
  x.keyValueList = he;
});
var k = j((T) => {
  "use strict";
  var ve =
    (T && T.__awaiter) ||
    function (e, t, n, r) {
      function i(s) {
        return s instanceof n
          ? s
          : new n(function (l) {
              l(s);
            });
      }
      return new (n || (n = Promise))(function (s, l) {
        function c(o) {
          try {
            u(r.next(o));
          } catch (f) {
            l(f);
          }
        }
        function a(o) {
          try {
            u(r.throw(o));
          } catch (f) {
            l(f);
          }
        }
        function u(o) {
          o.done ? s(o.value) : i(o.value).then(c, a);
        }
        u((r = r.apply(e, t || [])).next());
      });
    };
  Object.defineProperty(T, "__esModule", { value: !0 });
  T.ai = void 0;
  var pe = 4097,
    ye = 4,
    ge = 0.8,
    _e = pe * ye * ge;
  function me({
    name: e,
    prompt: t,
    message: n,
    postProcess: r,
    temperature: i,
    splitOn: s,
  }) {
    return {
      scriptTimeout: 15e3,
      custom: (l, c, a) =>
        ve(this, void 0, void 0, function* () {
          var u, o;
          let f = yield c({
            command: "fig",
            args: ["settings", "--format", "json", "autocomplete.ai.enabled"],
          });
          if (!JSON.parse(f.stdout)) return [];
          let y =
              typeof t == "function"
                ? yield t({ tokens: l, executeCommand: c, generatorContext: a })
                : t,
            S =
              typeof n == "function"
                ? yield n({ tokens: l, executeCommand: c, generatorContext: a })
                : n;
          if (S === null || S.length === 0)
            return console.warn("No message provided to AI generator"), [];
          let h = _e - ((u = y?.length) !== null && u !== void 0 ? u : 0),
            p = {
              model: "gpt-3.5-turbo",
              source: "autocomplete",
              name: e,
              messages: [
                ...(y ? [{ role: "system", content: y }] : []),
                { role: "user", content: S.slice(0, h) },
              ],
              temperature: i,
            },
            O = JSON.stringify(p),
            d = yield c({
              command: "fig",
              args: [
                "_",
                "request",
                "--route",
                "/ai/chat",
                "--method",
                "POST",
                "--body",
                O,
              ],
            }),
            m = JSON.parse(d.stdout);
          return (o = m?.choices
            .map((v) => {
              var w;
              return (w = v?.message) === null || w === void 0
                ? void 0
                : w.content;
            })
            .filter((v) => typeof v == "string")
            .flatMap((v) =>
              s ? v.split(s).filter((w) => w.trim().length > 0) : [v]
            )
            .map((v) => {
              if (r) return r(v);
              let w = v.trim().replace(/\n/g, " ");
              return {
                icon: "\u{1FA84}",
                name: w,
                insertValue: `'${w}'`,
                description: "Generated by Fig AI",
              };
            })) !== null && o !== void 0
            ? o
            : [];
        }),
    };
  }
  T.ai = me;
});
var G = j((_) => {
  "use strict";
  var Oe =
      (_ && _.__createBinding) ||
      (Object.create
        ? function (e, t, n, r) {
            r === void 0 && (r = n);
            var i = Object.getOwnPropertyDescriptor(t, n);
            (!i ||
              ("get" in i ? !t.__esModule : i.writable || i.configurable)) &&
              (i = {
                enumerable: !0,
                get: function () {
                  return t[n];
                },
              }),
              Object.defineProperty(e, r, i);
          }
        : function (e, t, n, r) {
            r === void 0 && (r = n), (e[r] = t[n]);
          }),
    be =
      (_ && _.__exportStar) ||
      function (e, t) {
        for (var n in e)
          n !== "default" &&
            !Object.prototype.hasOwnProperty.call(t, n) &&
            Oe(t, e, n);
      };
  Object.defineProperty(_, "__esModule", { value: !0 });
  _.ai = _.folders = _.filepaths = void 0;
  var B = z();
  Object.defineProperty(_, "filepaths", {
    enumerable: !0,
    get: function () {
      return B.filepaths;
    },
  });
  Object.defineProperty(_, "folders", {
    enumerable: !0,
    get: function () {
      return B.folders;
    },
  });
  be(H(), _);
  var Se = k();
  Object.defineProperty(_, "ai", {
    enumerable: !0,
    get: function () {
      return Se.ai;
    },
  });
});
var X = ie(G()),
  we = {
    name: "envctl",
    description: "Manager env files",
    subcommands: [
      {
        name: "use",
        description: "Choice a environment context",
        args: {
          description: "Context",
          generators: (0, X.filepaths)({
            filterFolders: !0,
            matches: /\.env\.(?<name>.+)/,
          }),
        },
      },
      {
        name: "list",
        description: "List all context available",
        subcommands: [],
      },
      {
        name: "init",
        description: "Initialize the env files.",
        subcommands: [],
      },
    ],
    options: [{ name: ["--help", "-h"], description: "Show help for envctl" }],
  },
  Fe = we;
export { Fe as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzL0BmaWcvYXV0b2NvbXBsZXRlLWdlbmVyYXRvcnMvbGliL3NyYy9yZXNvbHZlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlnL2F1dG9jb21wbGV0ZS1nZW5lcmF0b3JzL2xpYi9zcmMvZmlsZXBhdGhzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy9AZmlnL2F1dG9jb21wbGV0ZS1nZW5lcmF0b3JzL2xpYi9zcmMva2V5dmFsdWUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL0BmaWcvYXV0b2NvbXBsZXRlLWdlbmVyYXRvcnMvbGliL3NyYy9haS5qcyIsICIuLi9ub2RlX21vZHVsZXMvQGZpZy9hdXRvY29tcGxldGUtZ2VuZXJhdG9ycy9saWIvaW5kZXguanMiLCAiLi4vc3JjL2VudmN0bC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNoZWxsRXhwYW5kID0gZXhwb3J0cy5lbnN1cmVUcmFpbGluZ1NsYXNoID0gdm9pZCAwO1xuY29uc3QgZW5zdXJlVHJhaWxpbmdTbGFzaCA9IChzdHIpID0+IChzdHIuZW5kc1dpdGgoXCIvXCIpID8gc3RyIDogYCR7c3RyfS9gKTtcbmV4cG9ydHMuZW5zdXJlVHJhaWxpbmdTbGFzaCA9IGVuc3VyZVRyYWlsaW5nU2xhc2g7XG5jb25zdCByZXBsYWNlVGlsZGUgPSAocGF0aCwgaG9tZURpcikgPT4ge1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoXCJ+XCIpICYmIChwYXRoLmxlbmd0aCA9PT0gMSB8fCBwYXRoLmNoYXJBdCgxKSA9PT0gXCIvXCIpKSB7XG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoXCJ+XCIsIGhvbWVEaXIpO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aDtcbn07XG5jb25zdCByZXBsYWNlVmFyaWFibGVzID0gKHBhdGgsIGVudmlyb25tZW50VmFyaWFibGVzKSA9PiB7XG4gICAgLy8gUmVwbGFjZSBzaW1wbGUgJFZBUiB2YXJpYWJsZXNcbiAgICBjb25zdCByZXNvbHZlZFNpbXBsZVZhcmlhYmxlcyA9IHBhdGgucmVwbGFjZSgvXFwkKFtBLVphLXowLTlfXSspL2csIChrZXkpID0+IHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCBlbnZLZXkgPSBrZXkuc2xpY2UoMSk7XG4gICAgICAgIHJldHVybiAoX2EgPSBlbnZpcm9ubWVudFZhcmlhYmxlc1tlbnZLZXldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBrZXk7XG4gICAgfSk7XG4gICAgLy8gUmVwbGFjZSBjb21wbGV4ICR7VkFSfSB2YXJpYWJsZXNcbiAgICBjb25zdCByZXNvbHZlZENvbXBsZXhWYXJpYWJsZXMgPSByZXNvbHZlZFNpbXBsZVZhcmlhYmxlcy5yZXBsYWNlKC9cXCRcXHsoW0EtWmEtejAtOV9dKykoPzo6LShbXn1dKykpP1xcfS9nLCAobWF0Y2gsIGVudktleSwgZGVmYXVsdFZhbHVlKSA9PiB7IHZhciBfYSwgX2I7IHJldHVybiAoX2IgPSAoX2EgPSBlbnZpcm9ubWVudFZhcmlhYmxlc1tlbnZLZXldKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBkZWZhdWx0VmFsdWUpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG1hdGNoOyB9KTtcbiAgICByZXR1cm4gcmVzb2x2ZWRDb21wbGV4VmFyaWFibGVzO1xufTtcbmNvbnN0IHNoZWxsRXhwYW5kID0gKHBhdGgsIGNvbnRleHQpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgeyBlbnZpcm9ubWVudFZhcmlhYmxlcyB9ID0gY29udGV4dDtcbiAgICByZXR1cm4gcmVwbGFjZVZhcmlhYmxlcyhyZXBsYWNlVGlsZGUocGF0aCwgKF9hID0gZW52aXJvbm1lbnRWYXJpYWJsZXMgPT09IG51bGwgfHwgZW52aXJvbm1lbnRWYXJpYWJsZXMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudmlyb25tZW50VmFyaWFibGVzLkhPTUUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiflwiKSwgZW52aXJvbm1lbnRWYXJpYWJsZXMpO1xufTtcbmV4cG9ydHMuc2hlbGxFeHBhbmQgPSBzaGVsbEV4cGFuZDtcbiIsICJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5maWxlcGF0aHMgPSBleHBvcnRzLmZvbGRlcnMgPSBleHBvcnRzLmdldEN1cnJlbnRJbnNlcnRlZERpcmVjdG9yeSA9IGV4cG9ydHMuc29ydEZpbGVzQWxwaGFiZXRpY2FsbHkgPSB2b2lkIDA7XG5jb25zdCByZXNvbHZlXzEgPSByZXF1aXJlKFwiLi9yZXNvbHZlXCIpO1xuZnVuY3Rpb24gc29ydEZpbGVzQWxwaGFiZXRpY2FsbHkoYXJyYXksIHNraXAgPSBbXSkge1xuICAgIGNvbnN0IHNraXBMb3dlciA9IHNraXAubWFwKChzdHIpID0+IHN0ci50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCByZXN1bHRzID0gYXJyYXkuZmlsdGVyKCh4KSA9PiAhc2tpcExvd2VyLmluY2x1ZGVzKHgudG9Mb3dlckNhc2UoKSkpO1xuICAgIC8vIFB1dCBhbGwgZmlsZXMgYmVnaW5uaW5nIHdpdGggLiBhZnRlciBhbGwgdGhvc2UgdGhhdCBkb24ndCwgc29ydCBhbHBoYWJldGljYWxseSB3aXRoaW4gZWFjaC5cbiAgICByZXR1cm4gW1xuICAgICAgICAuLi5yZXN1bHRzLmZpbHRlcigoeCkgPT4gIXguc3RhcnRzV2l0aChcIi5cIikpLnNvcnQoKGEsIGIpID0+IGEubG9jYWxlQ29tcGFyZShiKSksXG4gICAgICAgIC4uLnJlc3VsdHMuZmlsdGVyKCh4KSA9PiB4LnN0YXJ0c1dpdGgoXCIuXCIpKS5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpLFxuICAgICAgICBcIi4uL1wiLFxuICAgIF07XG59XG5leHBvcnRzLnNvcnRGaWxlc0FscGhhYmV0aWNhbGx5ID0gc29ydEZpbGVzQWxwaGFiZXRpY2FsbHk7XG4vKipcbiAqIEBwYXJhbSBjd2QgLSBUaGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeSB3aGVuIHRoZSB1c2VyIHN0YXJ0ZWQgdHlwaW5nIHRoZSBuZXcgcGF0aFxuICogQHBhcmFtIHNlYXJjaFRlcm0gLSBUaGUgcGF0aCBpbnNlcnRlZCBieSB0aGUgdXNlciwgaXQgY2FuIGJlIHJlbGF0aXZlIHRvIGN3ZCBvciBhYnNvbHV0ZVxuICogQHJldHVybnMgVGhlIGRpcmVjdG9yeSB0aGUgdXNlciBpbnNlcnRlZCwgdGFraW5nIGludG8gYWNjb3VudCB0aGUgY3dkLlxuICovXG5jb25zdCBnZXRDdXJyZW50SW5zZXJ0ZWREaXJlY3RvcnkgPSAoY3dkLCBzZWFyY2hUZXJtLCBjb250ZXh0KSA9PiB7XG4gICAgaWYgKGN3ZCA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIFwiL1wiO1xuICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9ICgwLCByZXNvbHZlXzEuc2hlbGxFeHBhbmQpKHNlYXJjaFRlcm0sIGNvbnRleHQpO1xuICAgIGNvbnN0IGRpcm5hbWUgPSByZXNvbHZlZFBhdGguc2xpY2UoMCwgcmVzb2x2ZWRQYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIDEpO1xuICAgIGlmIChkaXJuYW1lID09PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiAoMCwgcmVzb2x2ZV8xLmVuc3VyZVRyYWlsaW5nU2xhc2gpKGN3ZCk7XG4gICAgfVxuICAgIHJldHVybiBkaXJuYW1lLnN0YXJ0c1dpdGgoXCIvXCIpID8gZGlybmFtZSA6IGAkeygwLCByZXNvbHZlXzEuZW5zdXJlVHJhaWxpbmdTbGFzaCkoY3dkKX0ke2Rpcm5hbWV9YDtcbn07XG5leHBvcnRzLmdldEN1cnJlbnRJbnNlcnRlZERpcmVjdG9yeSA9IGdldEN1cnJlbnRJbnNlcnRlZERpcmVjdG9yeTtcbi8qKlxuICogU3VnYXIgb3ZlciB1c2luZyB0aGUgYGZpbGVwYXRoc2AgdGVtcGxhdGUgd2l0aCBgZmlsdGVyVGVtcGxhdGVTdWdnZXN0aW9uc2AuIElmIGFueSBvZiB0aGVcbiAqIGNvbmRpdGlvbnMgbWF0Y2gsIHRoZSBzdWdnZXN0aW9uIHdpbGwgYmUgYWNjZXB0ZWQuXG4gKlxuICogQmFzaWMgZmlsZXBhdGggZmlsdGVycyBjYW4gYmUgcmVwbGFjZWQgd2l0aCB0aGlzIGdlbmVyYXRvci5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiAvLyBpbnNpZGUgYSBgRmlnLkFyZ2AuLi5cbiAqIGdlbmVyYXRvcnM6IGZpbGVwYXRocyh7IGV4dGVuc2lvbnM6IFtcIm1qc1wiLCBcImpzXCIsIFwianNvblwiXSB9KTtcbiAqIGBgYFxuICovXG5mdW5jdGlvbiBmaWxlcGF0aHNGbihvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGV4dGVuc2lvbnMgPSBbXSwgZXF1YWxzID0gW10sIG1hdGNoZXMsIGZpbHRlckZvbGRlcnMgPSBmYWxzZSwgZWRpdEZpbGVTdWdnZXN0aW9ucywgZWRpdEZvbGRlclN1Z2dlc3Rpb25zLCByb290RGlyZWN0b3J5LCBzaG93Rm9sZGVycyA9IFwiYWx3YXlzXCIsIH0gPSBvcHRpb25zO1xuICAgIC8vIFRPRE86IGF1dG9tYXRpY2FsbHkgcmVtb3ZlIGV2ZW50dWFsIGxlYWRpbmcgZG90c1xuICAgIGNvbnN0IGV4dGVuc2lvbnNTZXQgPSBuZXcgU2V0KGV4dGVuc2lvbnMpO1xuICAgIGNvbnN0IGVxdWFsc1NldCA9IG5ldyBTZXQoZXF1YWxzKTtcbiAgICAvLyBOT1RFOiBJZiBubyBmaWx0ZXIgaXMgcHJvdmlkZWQgd2Ugc2hvdWxkIG5vdCBydW4gdGhlIGZpbHRlclN1Z2dlc3Rpb25zIGZuLlxuICAgIC8vICEhIFdoZW4gbmV3IGZpbHRlcmluZyBwYXJhbWV0ZXJzIGFyZSBhZGRlZCB3ZSBzaG91bGQgaW5jcmVhc2UgdGhpcyBmdW5jdGlvblxuICAgIGNvbnN0IHNob3VsZEZpbHRlclN1Z2dlc3Rpb25zID0gKCkgPT4gZXh0ZW5zaW9ucy5sZW5ndGggPiAwIHx8IGVxdWFscy5sZW5ndGggPiAwIHx8IG1hdGNoZXM7XG4gICAgY29uc3QgZmlsdGVyU3VnZ2VzdGlvbnMgPSAoc3VnZ2VzdGlvbnMgPSBbXSkgPT4ge1xuICAgICAgICBpZiAoIXNob3VsZEZpbHRlclN1Z2dlc3Rpb25zKCkpXG4gICAgICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnM7XG4gICAgICAgIHJldHVybiBzdWdnZXN0aW9ucy5maWx0ZXIoKHsgbmFtZSA9IFwiXCIsIHR5cGUgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFmaWx0ZXJGb2xkZXJzICYmIHR5cGUgPT09IFwiZm9sZGVyXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAoZXF1YWxzU2V0LmhhcyhuYW1lKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzICYmICEhbmFtZS5tYXRjaChtYXRjaGVzKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIC8vIGhhbmRsZSBleHRlbnNpb25zXG4gICAgICAgICAgICBjb25zdCBbLCAuLi5zdWdnZXN0aW9uRXh0ZW5zaW9uc10gPSBuYW1lLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIGlmIChzdWdnZXN0aW9uRXh0ZW5zaW9ucy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGxldCBpID0gc3VnZ2VzdGlvbkV4dGVuc2lvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICBsZXQgc3RhY2tlZEV4dGVuc2lvbnMgPSBzdWdnZXN0aW9uRXh0ZW5zaW9uc1tpXTtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zU2V0LmhhcyhzdGFja2VkRXh0ZW5zaW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgLy8gYGlgIG1heSBiZWNvbWUgLTEgd2hpY2ggaXMgbm90IGEgdmFsaWQgaW5kZXgsIGJ1dCB0aGUgZXh0ZW5zaW9uU2V0IGNoZWNrIGF0IHRoZSBiZWdpbm5pbmcgaXMgbm90IHJ1biBpbiB0aGF0IGNhc2UsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIHRoZSB3cm9uZyBleHRlbnNpb24gaXMgbm90IGV2YWx1YXRlZFxuICAgICAgICAgICAgICAgICAgICBzdGFja2VkRXh0ZW5zaW9ucyA9IFtzdWdnZXN0aW9uRXh0ZW5zaW9uc1tpXSwgc3RhY2tlZEV4dGVuc2lvbnNdLmpvaW4oXCIuXCIpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKGkgPj0gMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgY29uc3QgcG9zdFByb2Nlc3NTdWdnZXN0aW9ucyA9IChzdWdnZXN0aW9ucyA9IFtdKSA9PiB7XG4gICAgICAgIGlmICghZWRpdEZpbGVTdWdnZXN0aW9ucyAmJiAhZWRpdEZvbGRlclN1Z2dlc3Rpb25zKVxuICAgICAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zO1xuICAgICAgICByZXR1cm4gc3VnZ2VzdGlvbnMubWFwKChzdWdnZXN0aW9uKSA9PiAoT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBzdWdnZXN0aW9uKSwgKChzdWdnZXN0aW9uLnR5cGUgPT09IFwiZmlsZVwiID8gZWRpdEZpbGVTdWdnZXN0aW9ucyA6IGVkaXRGb2xkZXJTdWdnZXN0aW9ucykgfHwge30pKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHJpZ2dlcjogKG9sZFRva2VuLCBuZXdUb2tlbikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb2xkTGFzdFNsYXNoSW5kZXggPSBvbGRUb2tlbi5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgICAgICBjb25zdCBuZXdMYXN0U2xhc2hJbmRleCA9IG5ld1Rva2VuLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBmaW5hbCBwYXRoIHNlZ21lbnQgaGFzIGNoYW5nZWQsIHRyaWdnZXIgbmV3IHN1Z2dlc3Rpb25zXG4gICAgICAgICAgICBpZiAob2xkTGFzdFNsYXNoSW5kZXggIT09IG5ld0xhc3RTbGFzaEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBIZXJlLCB0aGVyZSBjb3VsZCBlaXRoZXIgYmUgbm8gc2xhc2hlcywgb3Igc29tZXRoaW5nIGJlZm9yZSB0aGVcbiAgICAgICAgICAgIC8vIGZpbmFsIHNsYXNoIGhhcyBjaGFuZ2VkLiBJbiB0aGUgY2FzZSB3aGVyZSB0aGVyZSBhcmUgbm8gc2xhc2hlcyxcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IHdhbnQgdG8gdHJpZ2dlciBvbiBlYWNoIGtleXN0cm9rZSwgc28gZXhwbGljaXRseSByZXR1cm4gZmFsc2UuXG4gICAgICAgICAgICBpZiAob2xkTGFzdFNsYXNoSW5kZXggPT09IC0xICYmIG5ld0xhc3RTbGFzaEluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFdlIGtub3cgdGhlcmUncyBhdCBsZWFzdCBvbmUgc2xhc2ggaW4gdGhlIHN0cmluZyB0aGFua3MgdG8gdGhlIGNhc2VcbiAgICAgICAgICAgIC8vIGFib3ZlLCBzbyB0cmlnZ2VyIGlmIGFueXRoaW5nIGJlZm9yZSB0aGUgZmluYWwgc2xhc2ggaGFzIGNoYW5nZWQuXG4gICAgICAgICAgICByZXR1cm4gb2xkVG9rZW4uc2xpY2UoMCwgb2xkTGFzdFNsYXNoSW5kZXgpICE9PSBuZXdUb2tlbi5zbGljZSgwLCBuZXdMYXN0U2xhc2hJbmRleCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFF1ZXJ5VGVybTogKHRva2VuKSA9PiB0b2tlbi5zbGljZSh0b2tlbi5sYXN0SW5kZXhPZihcIi9cIikgKyAxKSxcbiAgICAgICAgY3VzdG9tOiAoXywgZXhlY3V0ZUNvbW1hbmQsIGdlbmVyYXRvckNvbnRleHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGNvbnN0IHsgaXNEYW5nZXJvdXMsIGN1cnJlbnRXb3JraW5nRGlyZWN0b3J5LCBzZWFyY2hUZXJtIH0gPSBnZW5lcmF0b3JDb250ZXh0O1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEluc2VydGVkRGlyZWN0b3J5ID0gKF9hID0gKDAsIGV4cG9ydHMuZ2V0Q3VycmVudEluc2VydGVkRGlyZWN0b3J5KShyb290RGlyZWN0b3J5ICE9PSBudWxsICYmIHJvb3REaXJlY3RvcnkgIT09IHZvaWQgMCA/IHJvb3REaXJlY3RvcnkgOiBjdXJyZW50V29ya2luZ0RpcmVjdG9yeSwgc2VhcmNoVGVybSwgZ2VuZXJhdG9yQ29udGV4dCkpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiL1wiO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgZXhlY3V0ZUNvbW1hbmQoe1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBcImxzXCIsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3M6IFtcIi0xQXBMXCJdLFxuICAgICAgICAgICAgICAgICAgICBjd2Q6IGN1cnJlbnRJbnNlcnRlZERpcmVjdG9yeSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3J0ZWRGaWxlcyA9IHNvcnRGaWxlc0FscGhhYmV0aWNhbGx5KGRhdGEuc3Rkb3V0LnNwbGl0KFwiXFxuXCIpLCBbXCIuRFNfU3RvcmVcIl0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGdlbmVyYXRvck91dHB1dEFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgLy8gVGhlbiBsb29wIHRocm91Z2ggdGhlbSBhbmQgYWRkIHRoZW0gdG8gdGhlIGdlbmVyYXRvck91dHB1dEFycmF5XG4gICAgICAgICAgICAgICAgLy8gZGVwZW5kaW5nIG9uIHRoZSB0ZW1wbGF0ZSB0eXBlXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHNvcnRlZEZpbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVR5cGUgPSBuYW1lLmVuZHNXaXRoKFwiL1wiKSA/IFwiZm9sZGVyc1wiIDogXCJmaWxlcGF0aHNcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGVtcGxhdGVUeXBlID09PSBcImZpbGVwYXRoc1wiICYmIHNob3dGb2xkZXJzICE9PSBcIm9ubHlcIikgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGVtcGxhdGVUeXBlID09PSBcImZvbGRlcnNcIiAmJiBzaG93Rm9sZGVycyAhPT0gXCJuZXZlclwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRvck91dHB1dEFycmF5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB0ZW1wbGF0ZVR5cGUgPT09IFwiZmlsZXBhdGhzXCIgPyBcImZpbGVcIiA6IFwiZm9sZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFZhbHVlOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0Rhbmdlcm91cyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogeyB0ZW1wbGF0ZVR5cGUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgc3VnZ2VzdGlvbnMuIFRoaXMgdGFrZXMgaW4gdGhlIGFycmF5IG9mIHN1Z2dlc3Rpb25zLCBmaWx0ZXJzIGl0LFxuICAgICAgICAgICAgICAgIC8vIGFuZCBvdXRwdXRzIGFuIGFycmF5IG9mIHN1Z2dlc3Rpb25zXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc3RQcm9jZXNzU3VnZ2VzdGlvbnMoZmlsdGVyU3VnZ2VzdGlvbnMoZ2VuZXJhdG9yT3V0cHV0QXJyYXkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgIH07XG59XG5leHBvcnRzLmZvbGRlcnMgPSBPYmplY3QuYXNzaWduKCgpID0+IGZpbGVwYXRoc0ZuKHsgc2hvd0ZvbGRlcnM6IFwib25seVwiIH0pLCBPYmplY3QuZnJlZXplKGZpbGVwYXRoc0ZuKHsgc2hvd0ZvbGRlcnM6IFwib25seVwiIH0pKSk7XG5leHBvcnRzLmZpbGVwYXRocyA9IE9iamVjdC5hc3NpZ24oZmlsZXBhdGhzRm4sIE9iamVjdC5mcmVlemUoZmlsZXBhdGhzRm4oKSkpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmtleVZhbHVlTGlzdCA9IGV4cG9ydHMua2V5VmFsdWUgPSBleHBvcnRzLnZhbHVlTGlzdCA9IHZvaWQgMDtcbi8qKiBDYWNoZSBvZiBGaWcgc3VnZ2VzdGlvbnMgdXNpbmcgdGhlIHN0cmluZ1tdL1N1Z2dlc3Rpb25bXS9mdW5jdGlvbiBhcyBhIGtleSAqL1xuY29uc3Qgc3VnZ2VzdGlvbkNhY2hlID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gYXBwZW5kVG9JbnNlcnRWYWx1ZShhcHBlbmQsIHN1Z2dlc3Rpb25zKSB7XG4gICAgaWYgKGFwcGVuZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zO1xuICAgIH1cbiAgICByZXR1cm4gc3VnZ2VzdGlvbnMubWFwKChpdGVtKSA9PiBpdGVtLmluc2VydFZhbHVlID8gaXRlbSA6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaXRlbSksIHsgaW5zZXJ0VmFsdWU6IGl0ZW0ubmFtZSArIGFwcGVuZCB9KSk7XG59XG5mdW5jdGlvbiBrdlN1Z2dlc3Rpb25zVG9GaWdTdWdnZXN0aW9ucyhzdWdnZXN0aW9ucywgYXBwZW5kLCBpbml0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzdWdnZXN0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBvdXQgPSB5aWVsZCBzdWdnZXN0aW9ucyguLi5pbml0KTtcbiAgICAgICAgICAgIHJldHVybiBhcHBlbmRUb0luc2VydFZhbHVlKGFwcGVuZCwgb3V0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHN1Z2dlc3Rpb25zWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBvdXQgPSBzdWdnZXN0aW9ucy5tYXAoKG5hbWUpID0+ICh7IG5hbWUgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIGFwcGVuZFRvSW5zZXJ0VmFsdWUoYXBwZW5kLCBvdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHBlbmRUb0luc2VydFZhbHVlKGFwcGVuZCwgc3VnZ2VzdGlvbnMpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0U3VnZ2VzdGlvbnMoc3VnZ2VzdGlvbnMsIGFwcGVuZCwgdXNlU3VnZ2VzdGlvbkNhY2hlLCBpbml0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKHVzZVN1Z2dlc3Rpb25DYWNoZSB8fCBBcnJheS5pc0FycmF5KHN1Z2dlc3Rpb25zKSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gc3VnZ2VzdGlvbkNhY2hlLmdldChzdWdnZXN0aW9ucyk7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0geWllbGQga3ZTdWdnZXN0aW9uc1RvRmlnU3VnZ2VzdGlvbnMoc3VnZ2VzdGlvbnMsIGFwcGVuZCwgaW5pdCk7XG4gICAgICAgICAgICAgICAgc3VnZ2VzdGlvbkNhY2hlLnNldChzdWdnZXN0aW9ucywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBrdlN1Z2dlc3Rpb25zVG9GaWdTdWdnZXN0aW9ucyhzdWdnZXN0aW9ucywgYXBwZW5kLCBpbml0KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHNob3VsZFVzZUNhY2hlKGlzS2V5LCBjYWNoZSkge1xuICAgIGlmICh0eXBlb2YgY2FjaGUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIChpc0tleSAmJiBjYWNoZSA9PT0gXCJrZXlzXCIpIHx8ICghaXNLZXkgJiYgY2FjaGUgPT09IFwidmFsdWVzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGU7XG59XG4vKiogR2V0IHRoZSBmaW5hbCBpbmRleCBvZiBhbnkgb2YgdGhlIHN0cmluZ3MgKi9cbmZ1bmN0aW9uIGxhc3RJbmRleE9mKGhheXN0YWNrLCAuLi5uZWVkbGVzKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KC4uLm5lZWRsZXMubWFwKChuZWVkbGUpID0+IGhheXN0YWNrLmxhc3RJbmRleE9mKG5lZWRsZSkpKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVJlcGVhdFN1Z2dlc3Rpb25zKGFscmVhZHlVc2VkLCBzdWdnZXN0aW9ucykge1xuICAgIGNvbnN0IHNlZW4gPSBuZXcgU2V0KGFscmVhZHlVc2VkKTtcbiAgICByZXR1cm4gc3VnZ2VzdGlvbnMuZmlsdGVyKChzdWdnZXN0aW9uKSA9PiB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdWdnZXN0aW9uLm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiAhc2Vlbi5oYXMoc3VnZ2VzdGlvbi5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gISgoX2EgPSBzdWdnZXN0aW9uLm5hbWUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zb21lKChuYW1lKSA9PiBzZWVuLmhhcyhuYW1lKSkpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGUgYSBnZW5lcmF0b3IgdGhhdCBnaXZlcyBzdWdnZXN0aW9ucyBmb3IgdmFsLHZhbCwuLi4gYXJndW1lbnRzLiBZb3VcbiAqIGNhbiB1c2UgYSBgc3RyaW5nW11gIG9yIGBGaWcuU3VnZ2VzdGlvbltdYCBmb3IgdGhlIHZhbHVlcy5cbiAqXG4gKiBZb3UgY2FuIHNldCBgY2FjaGU6IHRydWVgIHRvIGVuYWJsZSBjYWNoaW5nIHJlc3VsdHMuIFRoZSBzdWdnZXN0aW9ucyBhcmUgY2FjaGVkXG4gKiBnbG9iYWxseSB1c2luZyB0aGUgZnVuY3Rpb24gYXMgYSBrZXksIHNvIGVuYWJsaW5nIGNhY2hpbmcgZm9yIGFueSBvbmUgZ2VuZXJhdG9yXG4gKiB3aWxsIHNldCB0aGUgY2FjaGUgdmFsdWVzIGZvciB0aGUgZnVuY3Rpb25zIGZvciB0aGUgZW50aXJlIHNwZWMuIFRoaXMgYmVoYXZpb3JcbiAqIGNhbiBiZSB1c2VkIHRvIGNvbXBvc2UgZXhwZW5zaXZlIGdlbmVyYXRvcnMgd2l0aG91dCBpbmN1cnJpbmcgYSBjb3N0IGV2ZXJ5IHRpbWVcbiAqIHRoZXkncmUgdXNlZC5cbiAqXG4gKiBUaGUgcHJpbWFyeSB1c2Ugb2YgdGhpcyBpcyB0byBlbmFibGUgdGhlIHNhbWUgY2FjaGluZyBiZWhhdmlvciBhcyBga2V5VmFsdWVgXG4gKiBhbmQgYGtleVZhbHVlTGlzdGAuIElmIHlvdXIgZ29hbCBpcyB0byBjcmVhdGUgYSAkUEFUSC1saWtlIHZhbHVlLCB1c2UgYSBnZW5lcmF0b3JcbiAqIG9iamVjdCBsaXRlcmFsOiBgeyB0ZW1wbGF0ZTogXCJmaWxlcGF0aHNcIiwgdHJpZ2dlcjogXCI6XCIsIGdldFF1ZXJ5VGVybTogXCI6XCIgfWBcbiAqL1xuZnVuY3Rpb24gdmFsdWVMaXN0KHsgZGVsaW1pdGVyID0gXCIsXCIsIHZhbHVlcyA9IFtdLCBjYWNoZSA9IGZhbHNlLCBpbnNlcnREZWxpbWl0ZXIgPSBmYWxzZSwgYWxsb3dSZXBlYXRlZFZhbHVlcyA9IGZhbHNlLCB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHJpZ2dlcjogKG5ld1Rva2VuLCBvbGRUb2tlbikgPT4gbmV3VG9rZW4ubGFzdEluZGV4T2YoZGVsaW1pdGVyKSAhPT0gb2xkVG9rZW4ubGFzdEluZGV4T2YoZGVsaW1pdGVyKSxcbiAgICAgICAgZ2V0UXVlcnlUZXJtOiAodG9rZW4pID0+IHRva2VuLnNsaWNlKHRva2VuLmxhc3RJbmRleE9mKGRlbGltaXRlcikgKyBkZWxpbWl0ZXIubGVuZ3RoKSxcbiAgICAgICAgY3VzdG9tOiAoLi4uaW5pdCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgY29uc3Qgb3V0ID0geWllbGQgZ2V0U3VnZ2VzdGlvbnModmFsdWVzLCBpbnNlcnREZWxpbWl0ZXIgPyBkZWxpbWl0ZXIgOiBcIlwiLCBjYWNoZSwgaW5pdCk7XG4gICAgICAgICAgICBpZiAoYWxsb3dSZXBlYXRlZFZhbHVlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBbdG9rZW5zXSA9IGluaXQ7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXNJbkxpc3QgPSAoX2EgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3BsaXQoZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVSZXBlYXRTdWdnZXN0aW9ucyh2YWx1ZXNJbkxpc3QsIG91dCk7XG4gICAgICAgIH0pLFxuICAgIH07XG59XG5leHBvcnRzLnZhbHVlTGlzdCA9IHZhbHVlTGlzdDtcbi8qKlxuICogQ3JlYXRlIGEgZ2VuZXJhdG9yIHRoYXQgZ2l2ZXMgc3VnZ2VzdGlvbnMgZm9yIGtleT12YWx1ZSBhcmd1bWVudHMuIFlvdVxuICogY2FuIHVzZSBhIGBzdHJpbmdbXWAgb3IgYEZpZy5TdWdnZXN0aW9uW11gIGZvciB0aGUga2V5cyBhbmQgdmFsdWVzLCBvciBhXG4gKiBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyBgRmlnLkdlbmVyYXRvcltcImN1c3RvbVwiXWAuXG4gKlxuICogWW91IGNhbiBzZXQgYGNhY2hlOiB0cnVlYCB0byBlbmFibGUgY2FjaGluZyByZXN1bHRzLiBUaGUgc3VnZ2VzdGlvbnMgYXJlIGNhY2hlZFxuICogZ2xvYmFsbHkgdXNpbmcgdGhlIGZ1bmN0aW9uIGFzIGEga2V5LCBzbyBlbmFibGluZyBjYWNoaW5nIGZvciBhbnkgb25lIGdlbmVyYXRvclxuICogd2lsbCBzZXQgdGhlIGNhY2hlIHZhbHVlcyBmb3IgdGhlIGZ1bmN0aW9ucyBmb3IgdGhlIGVudGlyZSBzcGVjLiBUaGlzIGJlaGF2aW9yXG4gKiBjYW4gYmUgdXNlZCB0byBjb3BtcG9zZSBleHBlbnNpdmUga2V5L3ZhbHVlIGdlbmVyYXRvcnMgd2l0aG91dCBpbmN1cnJpbmcgdGhlXG4gKiBpbml0aWFsIGNvc3QgZXZlcnkgdGltZSB0aGV5J3JlIHVzZWQuXG4gKlxuICogTm90ZSB0aGF0IHlvdSBzaG91bGQgb25seSBjYWNoZSBnZW5lcmF0b3JzIHRoYXQgcHJvZHVjZSB0aGUgc2FtZSBvdXRwdXQgcmVnYXJkbGVzc1xuICogb2YgdGhlaXIgaW5wdXQuIFlvdSBjYW4gY2FjaGUgZWl0aGVyIHRoZSBrZXlzIG9yIHZhbHVlcyBpbmRpdmlkdWFsbHkgdXNpbmcgYFwia2V5c1wiYFxuICogb3IgYFwidmFsdWVzXCJgIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gc2V0LXZhbHVlcyBhPTEgYj0zIGM9MlxuICogY29uc3Qgc3BlYzogRmlnLlNwZWMgPSB7XG4gKiAgIG5hbWU6IFwic2V0LXZhbHVlc1wiLFxuICogICBhcmdzOiB7XG4gKiAgICAgbmFtZTogXCJ2YWx1ZXNcIixcbiAqICAgICBpc1ZhcmlhZGljOiB0cnVlLFxuICogICAgIGdlbmVyYXRvcnM6IGtleVZhbHVlKHtcbiAqICAgICAgIGtleXM6IFtcImFcIiwgXCJiXCIsIFwiY1wiXSxcbiAqICAgICAgIHZhbHVlczogW1wiMVwiLCBcIjJcIiwgXCIzXCJdLFxuICogICAgIH0pLFxuICogICB9LFxuICogfVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgVGhlIHNlcGFyYXRvciBiZXR3ZWVuIGtleXMgYW5kIHZhbHVlcyBjYW4gYmUgY3VzdG9taXplZCAoZGVmYXVsdDogYD1gKVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIGtleTE6dmFsdWVcbiAqIGtleVZhbHVlKHtcbiAqICAgc2VwYXJhdG9yOiBcIjpcIixcbiAqICAga2V5czogW1xuICogICAgIHsgbmFtZTogXCJrZXkxXCIsIGljb246IFwiZmlnOi8vaWNvbj90eXBlPXN0cmluZ1wiIH0sXG4gKiAgICAgeyBuYW1lOiBcImtleTJcIiwgaWNvbjogXCJmaWc6Ly9pY29uP3R5cGU9c3RyaW5nXCIgfSxcbiAqICAgXSxcbiAqIH0pLFxuICogYGBgXG4gKi9cbmZ1bmN0aW9uIGtleVZhbHVlKHsgc2VwYXJhdG9yID0gXCI9XCIsIGtleXMgPSBbXSwgdmFsdWVzID0gW10sIGNhY2hlID0gZmFsc2UsIGluc2VydFNlcGFyYXRvciA9IHRydWUsIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0cmlnZ2VyOiAobmV3VG9rZW4sIG9sZFRva2VuKSA9PiBuZXdUb2tlbi5pbmRleE9mKHNlcGFyYXRvcikgIT09IG9sZFRva2VuLmluZGV4T2Yoc2VwYXJhdG9yKSxcbiAgICAgICAgZ2V0UXVlcnlUZXJtOiAodG9rZW4pID0+IHRva2VuLnNsaWNlKHRva2VuLmluZGV4T2Yoc2VwYXJhdG9yKSArIDEpLFxuICAgICAgICBjdXN0b206ICguLi5pbml0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBbdG9rZW5zXSA9IGluaXQ7XG4gICAgICAgICAgICBjb25zdCBmaW5hbFRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGNvbnN0IGlzS2V5ID0gIWZpbmFsVG9rZW4uaW5jbHVkZXMoc2VwYXJhdG9yKTtcbiAgICAgICAgICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gaXNLZXkgPyBrZXlzIDogdmFsdWVzO1xuICAgICAgICAgICAgY29uc3QgdXNlQ2FjaGUgPSBzaG91bGRVc2VDYWNoZShpc0tleSwgY2FjaGUpO1xuICAgICAgICAgICAgY29uc3QgYXBwZW5kID0gaXNLZXkgPyAoaW5zZXJ0U2VwYXJhdG9yID8gc2VwYXJhdG9yIDogXCJcIikgOiBcIlwiO1xuICAgICAgICAgICAgcmV0dXJuIGdldFN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zLCBhcHBlbmQsIHVzZUNhY2hlLCBpbml0KTtcbiAgICAgICAgfSksXG4gICAgfTtcbn1cbmV4cG9ydHMua2V5VmFsdWUgPSBrZXlWYWx1ZTtcbi8qKlxuICogQ3JlYXRlIGEgZ2VuZXJhdG9yIHRoYXQgZ2l2ZXMgc3VnZ2VzdGlvbnMgZm9yIGBrPXYsaz12LC4uLmAgYXJndW1lbnRzLiBZb3VcbiAqIGNhbiB1c2UgYSBgc3RyaW5nW11gIG9yIGBGaWcuU3VnZ2VzdGlvbltdYCBmb3IgdGhlIGtleXMgYW5kIHZhbHVlcywgb3IgYVxuICogZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBzaWduYXR1cmUgYXMgYEZpZy5HZW5lcmF0b3JbXCJjdXN0b21cIl1gXG4gKlxuICogWW91IGNhbiBzZXQgYGNhY2hlOiB0cnVlYCB0byBlbmFibGUgY2FjaGluZyByZXN1bHRzLiBUaGUgc3VnZ2VzdGlvbnMgYXJlIGNhY2hlZFxuICogZ2xvYmFsbHkgdXNpbmcgdGhlIGZ1bmN0aW9uIGFzIGEga2V5LCBzbyBlbmFibGluZyBjYWNoaW5nIGZvciBhbnkgb25lIGdlbmVyYXRvclxuICogd2lsbCBzZXQgdGhlIGNhY2hlIHZhbHVlcyBmb3IgdGhlIGZ1bmN0aW9ucyBmb3IgdGhlIGVudGlyZSBzcGVjLiBUaGlzIGJlaGF2aW9yXG4gKiBjYW4gYmUgdXNlZCB0byBjb3BtcG9zZSBleHBlbnNpdmUga2V5L3ZhbHVlIGdlbmVyYXRvcnMgd2l0aG91dCBpbmN1cnJpbmcgdGhlXG4gKiBpbml0aWFsIGNvc3QgZXZlcnkgdGltZSB0aGV5J3JlIHVzZWQuXG4gKlxuICogTm90ZSB0aGF0IHlvdSBzaG91bGQgb25seSBjYWNoZSBnZW5lcmF0b3JzIHRoYXQgcHJvZHVjZSB0aGUgc2FtZSBvdXRwdXQgcmVnYXJkbGVzc1xuICogb2YgdGhlaXIgaW5wdXQuIFlvdSBjYW4gY2FjaGUgZWl0aGVyIHRoZSBrZXlzIG9yIHZhbHVlcyBpbmRpdmlkdWFsbHkgdXNpbmcgYFwia2V5c1wiYFxuICogb3IgYFwidmFsdWVzXCJgIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogLy8gc2V0LXZhbHVlcyBhPTEsYj0zLGM9MlxuICogY29uc3Qgc3BlYzogRmlnLlNwZWMgPSB7XG4gKiAgIG5hbWU6IFwic2V0LXZhbHVlc1wiLFxuICogICBhcmdzOiB7XG4gKiAgICAgbmFtZTogXCJ2YWx1ZXNcIixcbiAqICAgICBnZW5lcmF0b3JzOiBrZXlWYWx1ZUxpc3Qoe1xuICogICAgICAga2V5czogW1wiYVwiLCBcImJcIiwgXCJjXCJdLFxuICogICAgICAgdmFsdWVzOiBbXCIxXCIsIFwiMlwiLCBcIjNcIl0sXG4gKiAgICAgfSksXG4gKiAgIH0sXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqIFRoZSBzZXBhcmF0b3IgYmV0d2VlbiBrZXlzIGFuZCB2YWx1ZXMgY2FuIGJlIGN1c3RvbWl6ZWQuIEl0J3MgYD1gIGJ5XG4gKiBkZWZhdWx0LiBZb3UgY2FuIGFsc28gY2hhbmdlIHRoZSBrZXkvdmFsdWUgcGFpciBkZWxpbWl0ZXIsIHdoaWNoIGlzIGAsYFxuICogYnkgZGVmYXVsdC5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAvLyBrZXkxOnZhbHVlJmtleTI6YW5vdGhlclxuICoga2V5VmFsdWVMaXN0KHtcbiAqICAgc2VwYXJhdG9yOiBcIjpcIixcbiAqICAgZGVsaW1pdGVyOiBcIiZcIlxuICogICBrZXlzOiBbXG4gKiAgICAgeyBuYW1lOiBcImtleTFcIiwgaWNvbjogXCJmaWc6Ly9pY29uP3R5cGU9c3RyaW5nXCIgfSxcbiAqICAgICB7IG5hbWU6IFwia2V5MlwiLCBpY29uOiBcImZpZzovL2ljb24/dHlwZT1zdHJpbmdcIiB9LFxuICogICBdLFxuICogfSksXG4gKiBgYGBcbiAqL1xuZnVuY3Rpb24ga2V5VmFsdWVMaXN0KHsgc2VwYXJhdG9yID0gXCI9XCIsIGRlbGltaXRlciA9IFwiLFwiLCBrZXlzID0gW10sIHZhbHVlcyA9IFtdLCBjYWNoZSA9IGZhbHNlLCBpbnNlcnRTZXBhcmF0b3IgPSB0cnVlLCBpbnNlcnREZWxpbWl0ZXIgPSBmYWxzZSwgYWxsb3dSZXBlYXRlZEtleXMgPSBmYWxzZSwgYWxsb3dSZXBlYXRlZFZhbHVlcyA9IHRydWUsIH0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0cmlnZ2VyOiAobmV3VG9rZW4sIG9sZFRva2VuKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXdUb2tlbklkeCA9IGxhc3RJbmRleE9mKG5ld1Rva2VuLCBzZXBhcmF0b3IsIGRlbGltaXRlcik7XG4gICAgICAgICAgICBjb25zdCBvbGRUb2tlbklkeCA9IGxhc3RJbmRleE9mKG9sZFRva2VuLCBzZXBhcmF0b3IsIGRlbGltaXRlcik7XG4gICAgICAgICAgICByZXR1cm4gbmV3VG9rZW5JZHggIT09IG9sZFRva2VuSWR4O1xuICAgICAgICB9LFxuICAgICAgICBnZXRRdWVyeVRlcm06ICh0b2tlbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBsYXN0SW5kZXhPZih0b2tlbiwgc2VwYXJhdG9yLCBkZWxpbWl0ZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuLnNsaWNlKGluZGV4ICsgMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGN1c3RvbTogKC4uLmluaXQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IFt0b2tlbnNdID0gaW5pdDtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsVG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBsYXN0SW5kZXhPZihmaW5hbFRva2VuLCBzZXBhcmF0b3IsIGRlbGltaXRlcik7XG4gICAgICAgICAgICBjb25zdCBpc0tleSA9IGluZGV4ID09PSAtMSB8fCBmaW5hbFRva2VuLnNsaWNlKGluZGV4LCBpbmRleCArIHNlcGFyYXRvci5sZW5ndGgpICE9PSBzZXBhcmF0b3I7XG4gICAgICAgICAgICBjb25zdCBzdWdnZXN0aW9ucyA9IGlzS2V5ID8ga2V5cyA6IHZhbHVlcztcbiAgICAgICAgICAgIGNvbnN0IHVzZUNhY2hlID0gc2hvdWxkVXNlQ2FjaGUoaXNLZXksIGNhY2hlKTtcbiAgICAgICAgICAgIGNvbnN0IGFwcGVuZCA9IGlzS2V5ID8gKGluc2VydFNlcGFyYXRvciA/IHNlcGFyYXRvciA6IFwiXCIpIDogaW5zZXJ0RGVsaW1pdGVyID8gZGVsaW1pdGVyIDogXCJcIjtcbiAgICAgICAgICAgIGNvbnN0IG91dCA9IHlpZWxkIGdldFN1Z2dlc3Rpb25zKHN1Z2dlc3Rpb25zLCBhcHBlbmQsIHVzZUNhY2hlLCBpbml0KTtcbiAgICAgICAgICAgIGlmIChpc0tleSkge1xuICAgICAgICAgICAgICAgIGlmIChhbGxvd1JlcGVhdGVkS2V5cykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBleGlzdGluZ0tleXMgPSBmaW5hbFRva2VuXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdChkZWxpbWl0ZXIpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKGNodW5rKSA9PiBjaHVuay5zbGljZSgwLCBjaHVuay5pbmRleE9mKHNlcGFyYXRvcikpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlUmVwZWF0U3VnZ2VzdGlvbnMoZXhpc3RpbmdLZXlzLCBvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFsbG93UmVwZWF0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdWYWx1ZXMgPSBmaW5hbFRva2VuXG4gICAgICAgICAgICAgICAgLnNwbGl0KGRlbGltaXRlcilcbiAgICAgICAgICAgICAgICAubWFwKChjaHVuaykgPT4gY2h1bmsuc2xpY2UoY2h1bmsuaW5kZXhPZihzZXBhcmF0b3IpICsgc2VwYXJhdG9yLmxlbmd0aCkpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbW92ZVJlcGVhdFN1Z2dlc3Rpb25zKGV4aXN0aW5nVmFsdWVzLCBvdXQpO1xuICAgICAgICB9KSxcbiAgICB9O1xufVxuZXhwb3J0cy5rZXlWYWx1ZUxpc3QgPSBrZXlWYWx1ZUxpc3Q7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWkgPSB2b2lkIDA7XG5jb25zdCBNQVhfVE9LRU5TID0gNDA5NztcbmNvbnN0IFRPS0VOX1RPX0NIQVJfUkFUSU8gPSA0O1xuY29uc3QgTUFSR0lOX1JBVElPID0gMC44O1xuY29uc3QgTUFYX0NIQVJTID0gTUFYX1RPS0VOUyAqIFRPS0VOX1RPX0NIQVJfUkFUSU8gKiBNQVJHSU5fUkFUSU87XG4vKipcbiAqIEEgZ2VuZXJhdG9yIHRoYXQgdXNlcyB0aGUgRmlnIEFJIEFQSSB0byBnZW5lcmF0ZSBzdWdnZXN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gcHJvbXB0IFRoZSBwcm9tcHQgdG8gdXNlIGZvciB0aGUgQUkuIENhbiBiZSBhIHN0cmluZyBvciBhIGdlbmVyYXRvciBmdW5jdGlvbi5cbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIHNlbmQgdG8gdGhlIEFJLiBDYW4gYmUgYSBzdHJpbmcgb3IgYSBnZW5lcmF0b3IgZnVuY3Rpb24uXG4gKiBAcGFyYW0gcG9zdFByb2Nlc3MgQSBmdW5jdGlvbiB0byBwb3N0LXByb2Nlc3MgdGhlIEFJJ3MgcmVzcG9uc2UuXG4gKiBAcGFyYW0gdGVtcGVyYXR1cmUgVGhlIHRlbXBlcmF0dXJlIHRvIHVzZSBmb3IgdGhlIEFJLlxuICogQHJldHVybnMgQSBGaWcgZ2VuZXJhdG9yLlxuICovXG5mdW5jdGlvbiBhaSh7IG5hbWUsIHByb21wdCwgbWVzc2FnZSwgcG9zdFByb2Nlc3MsIHRlbXBlcmF0dXJlLCBzcGxpdE9uLCB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2NyaXB0VGltZW91dDogMTUwMDAsXG4gICAgICAgIGN1c3RvbTogKHRva2VucywgZXhlY3V0ZUNvbW1hbmQsIGdlbmVyYXRvckNvbnRleHQpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICBjb25zdCBzZXR0aW5nT3V0cHV0ID0geWllbGQgZXhlY3V0ZUNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIGNvbW1hbmQ6IFwiZmlnXCIsXG4gICAgICAgICAgICAgICAgYXJnczogW1wic2V0dGluZ3NcIiwgXCItLWZvcm1hdFwiLCBcImpzb25cIiwgXCJhdXRvY29tcGxldGUuYWkuZW5hYmxlZFwiXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFKU09OLnBhcnNlKHNldHRpbmdPdXRwdXQuc3Rkb3V0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByb21wdFN0cmluZyA9IHR5cGVvZiBwcm9tcHQgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICAgICAgICAgID8geWllbGQgcHJvbXB0KHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLFxuICAgICAgICAgICAgICAgICAgICBleGVjdXRlQ29tbWFuZCxcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yQ29udGV4dCxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIDogcHJvbXB0O1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZVN0cmluZyA9IHR5cGVvZiBtZXNzYWdlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgICAgICA/IHlpZWxkIG1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMsXG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dGVDb21tYW5kLFxuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0b3JDb250ZXh0LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgOiBtZXNzYWdlO1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2VTdHJpbmcgPT09IG51bGwgfHwgbWVzc2FnZVN0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBtZXNzYWdlIHByb3ZpZGVkIHRvIEFJIGdlbmVyYXRvclwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBidWRnZXQgPSBNQVhfQ0hBUlMgLSAoKF9hID0gcHJvbXB0U3RyaW5nID09PSBudWxsIHx8IHByb21wdFN0cmluZyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJvbXB0U3RyaW5nLmxlbmd0aCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMCk7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0ge1xuICAgICAgICAgICAgICAgIG1vZGVsOiBcImdwdC0zLjUtdHVyYm9cIixcbiAgICAgICAgICAgICAgICBzb3VyY2U6IFwiYXV0b2NvbXBsZXRlXCIsXG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgICAgICAgICAuLi4ocHJvbXB0U3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IFwic3lzdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHByb21wdFN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBbXSksXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogbWVzc2FnZVN0cmluZy5zbGljZSgwLCBidWRnZXQpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgdGVtcGVyYXR1cmUsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgYm9keUpzb24gPSBKU09OLnN0cmluZ2lmeShib2R5KTtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RPdXRwdXQgPSB5aWVsZCBleGVjdXRlQ29tbWFuZCh7XG4gICAgICAgICAgICAgICAgY29tbWFuZDogXCJmaWdcIixcbiAgICAgICAgICAgICAgICBhcmdzOiBbXCJfXCIsIFwicmVxdWVzdFwiLCBcIi0tcm91dGVcIiwgXCIvYWkvY2hhdFwiLCBcIi0tbWV0aG9kXCIsIFwiUE9TVFwiLCBcIi0tYm9keVwiLCBib2R5SnNvbl0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHJlcXVlc3RPdXRwdXQuc3Rkb3V0KTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSAoX2IgPSBqc29uID09PSBudWxsIHx8IGpzb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGpzb24uY2hvaWNlcy5tYXAoKGMpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gYyA9PT0gbnVsbCB8fCBjID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjLm1lc3NhZ2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb250ZW50OyB9KS5maWx0ZXIoKGMpID0+IHR5cGVvZiBjID09PSBcInN0cmluZ1wiKS5mbGF0TWFwKChjKSA9PiBzcGxpdE9uID8gYy5zcGxpdChzcGxpdE9uKS5maWx0ZXIoKHMpID0+IHMudHJpbSgpLmxlbmd0aCA+IDApIDogW2NdKS5tYXAoKG91dCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwb3N0UHJvY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9zdFByb2Nlc3Mob3V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IG91dC50cmltKCkucmVwbGFjZSgvXFxuL2csIFwiIFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpY29uOiBcIlx1RDgzRVx1REU4NFwiLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICBpbnNlcnRWYWx1ZTogYCcke3RleHR9J2AsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlbmVyYXRlZCBieSBGaWcgQUlcIixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSkpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH0pLFxuICAgIH07XG59XG5leHBvcnRzLmFpID0gYWk7XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYWkgPSBleHBvcnRzLmZvbGRlcnMgPSBleHBvcnRzLmZpbGVwYXRocyA9IHZvaWQgMDtcbnZhciBmaWxlcGF0aHNfMSA9IHJlcXVpcmUoXCIuL3NyYy9maWxlcGF0aHNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJmaWxlcGF0aHNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZpbGVwYXRoc18xLmZpbGVwYXRoczsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImZvbGRlcnNcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZpbGVwYXRoc18xLmZvbGRlcnM7IH0gfSk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3JjL2tleXZhbHVlXCIpLCBleHBvcnRzKTtcbnZhciBhaV8xID0gcmVxdWlyZShcIi4vc3JjL2FpXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiYWlcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFpXzEuYWk7IH0gfSk7XG4iLCAiaW1wb3J0IHsgZmlsZXBhdGhzLCB9IGZyb20gXCJAZmlnL2F1dG9jb21wbGV0ZS1nZW5lcmF0b3JzXCI7XG5cbmNvbnN0IGNvbXBsZXRpb25TcGVjOiBGaWcuU3BlYyA9IHtcbiAgbmFtZTogXCJlbnZjdGxcIixcbiAgZGVzY3JpcHRpb246IFwiTWFuYWdlciBlbnYgZmlsZXNcIixcbiAgc3ViY29tbWFuZHM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcInVzZVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiQ2hvaWNlIGEgZW52aXJvbm1lbnQgY29udGV4dFwiLFxuICAgICAgYXJnczoge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0NvbnRleHQnLFxuICAgICAgICBnZW5lcmF0b3JzOiBmaWxlcGF0aHMoe1xuICAgICAgICAgIGZpbHRlckZvbGRlcnM6IHRydWUsXG4gICAgICAgICAgbWF0Y2hlczogL1xcLmVudlxcLig/PG5hbWU+LispLyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwibGlzdFwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiTGlzdCBhbGwgY29udGV4dCBhdmFpbGFibGVcIixcbiAgICAgIHN1YmNvbW1hbmRzOiBbXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6IFwiaW5pdFwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiSW5pdGlhbGl6ZSB0aGUgZW52IGZpbGVzLlwiLFxuICAgICAgc3ViY29tbWFuZHM6IFtdLFxuICAgIH0sXG4gIF0sXG4gIG9wdGlvbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBbXCItLWhlbHBcIiwgXCItaFwiXSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgaGVscCBmb3IgZW52Y3RsXCIsXG4gICAgfSxcbiAgXSxcbn07XG5leHBvcnQgZGVmYXVsdCBjb21wbGV0aW9uU3BlYztcbiJdLAogICJtYXBwaW5ncyI6ICJraEJBQUEsSUFBQUEsRUFBQUMsRUFBQUMsR0FBQSxjQUNBLE9BQU8sZUFBZUEsRUFBUyxhQUFjLENBQUUsTUFBTyxFQUFLLENBQUMsRUFDNURBLEVBQVEsWUFBY0EsRUFBUSxvQkFBc0IsT0FDcEQsSUFBTUMsR0FBdUJDLEdBQVNBLEVBQUksU0FBUyxHQUFHLEVBQUlBLEVBQU0sR0FBR0EsQ0FBRyxJQUN0RUYsRUFBUSxvQkFBc0JDLEdBQzlCLElBQU1FLEdBQWUsQ0FBQ0MsRUFBTUMsSUFDcEJELEVBQUssV0FBVyxHQUFHLElBQU1BLEVBQUssU0FBVyxHQUFLQSxFQUFLLE9BQU8sQ0FBQyxJQUFNLEtBQzFEQSxFQUFLLFFBQVEsSUFBS0MsQ0FBTyxFQUU3QkQsRUFFTEUsR0FBbUIsQ0FBQ0YsRUFBTUcsSUFFSUgsRUFBSyxRQUFRLHFCQUF1QkksR0FBUSxDQUN4RSxJQUFJQyxFQUNKLElBQU1DLEVBQVNGLEVBQUksTUFBTSxDQUFDLEVBQzFCLE9BQVFDLEVBQUtGLEVBQXFCRyxDQUFNLEtBQU8sTUFBUUQsSUFBTyxPQUFTQSxFQUFLRCxDQUNoRixDQUFDLEVBRXdELFFBQVEsdUNBQXdDLENBQUNHLEVBQU9ELEVBQVFFLElBQWlCLENBQUUsSUFBSUgsRUFBSUksRUFBSSxPQUFRQSxHQUFNSixFQUFLRixFQUFxQkcsQ0FBTSxLQUFPLE1BQVFELElBQU8sT0FBU0EsRUFBS0csS0FBa0IsTUFBUUMsSUFBTyxPQUFTQSxFQUFLRixDQUFPLENBQUMsRUFHL1JHLEdBQWMsQ0FBQ1YsRUFBTVcsSUFBWSxD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Q1AsQ0FDRSxLQUFNLENBQUMsU0FBVSxJQUFJLEVBQ3JCLFlBQWEsc0JBQ2YsQ0FDRixDQUNGLEVBQ09DLEdBQVFEIiwKICAibmFtZXMiOiBbInJlcXVpcmVfcmVzb2x2ZSIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiZW5zdXJlVHJhaWxpbmdTbGFzaCIsICJzdHIiLCAicmVwbGFjZVRpbGRlIiwgInBhdGgiLCAiaG9tZURpciIsICJyZXBsYWNlVmFyaWFibGVzIiwgImVudmlyb25tZW50VmFyaWFibGVzIiwgImtleSIsICJfYSIsICJlbnZLZXkiLCAibWF0Y2giLCAiZGVmYXVsdFZhbHVlIiwgIl9iIiwgInNoZWxsRXhwYW5kIiwgImNvbnRleHQiLCAicmVxdWlyZV9maWxlcGF0aHMiLCAiX19jb21tb25KU01pbiIsICJleHBvcnRzIiwgIl9fYXdhaXRlciIsICJ0aGlzQXJnIiwgIl9hcmd1bWVudHMiLCAiUCIsICJnZW5lcmF0b3IiLCAiYWRvcHQiLCAidmFsdWUiLCAicmVzb2x2ZSIsICJyZWplY3QiLCAiZnVsZmlsbGVkIiwgInN0ZXAiLCAiZSIsICJyZWplY3RlZCIsICJyZXN1bHQiLCAicmVzb2x2ZV8xIiwgInNvcnRGaWxlc0FscGhhYmV0aWNhbGx5IiwgImFycmF5IiwgInNraXAiLCAic2tpcExvd2VyIiwgInN0ciIsICJyZXN1bHRzIiwgIngiLCAiYSIsICJiIiwgImdldEN1cnJlbnRJbnNlcnRlZERpcmVjdG9yeSIsICJjd2QiLCAic2VhcmNoVGVybSIsICJjb250ZXh0IiwgInJlc29sdmVkUGF0aCIsICJkaXJuYW1lIiwgImZpbGVwYXRoc0ZuIiwgIm9wdGlvbnMiLCAiZXh0ZW5zaW9ucyIsICJlcXVhbHMiLCAibWF0Y2hlcyIsICJmaWx0ZXJGb2xkZXJzIiwgImVkaXRGaWxlU3VnZ2VzdGlvbnMiLCAiZWRpdEZvbGRlclN1Z2dlc3Rpb25zIiwgInJvb3REaXJlY3RvcnkiLCAic2hvd0ZvbGRlcnMiLCAiZXh0ZW5zaW9uc1NldCIsICJlcXVhbHNTZXQiLCAic2hvdWxkRmlsdGVyU3VnZ2VzdGlvbnMiLCAiZmlsdGVyU3VnZ2VzdGlvbnMiLCAic3VnZ2VzdGlvbnMiLCAibmFtZSIsICJ0eXBlIiwgInN1Z2dlc3Rpb25FeHRlbnNpb25zIiwgImkiLCAic3RhY2tlZEV4dGVuc2lvbnMiLCAicG9zdFByb2Nlc3NTdWdnZXN0aW9ucyIsICJzdWdnZXN0aW9uIiwgIm9sZFRva2VuIiwgIm5ld1Rva2VuIiwgIm9sZExhc3RTbGFzaEluZGV4IiwgIm5ld0xhc3RTbGFzaEluZGV4IiwgInRva2VuIiwgIl8iLCAiZXhlY3V0ZUNvbW1hbmQiLCAiZ2VuZXJhdG9yQ29udGV4dCIsICJfYSIsICJpc0Rhbmdlcm91cyIsICJjdXJyZW50V29ya2luZ0RpcmVjdG9yeSIsICJjdXJyZW50SW5zZXJ0ZWREaXJlY3RvcnkiLCAiZGF0YSIsICJzb3J0ZWRGaWxlcyIsICJnZW5lcmF0b3JPdXRwdXRBcnJheSIsICJ0ZW1wbGF0ZVR5cGUiLCAicmVxdWlyZV9rZXl2YWx1ZSIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiX19hd2FpdGVyIiwgInRoaXNBcmciLCAiX2FyZ3VtZW50cyIsICJQIiwgImdlbmVyYXRvciIsICJhZG9wdCIsICJ2YWx1ZSIsICJyZXNvbHZlIiwgInJlamVjdCIsICJmdWxmaWxsZWQiLCAic3RlcCIsICJlIiwgInJlamVjdGVkIiwgInJlc3VsdCIsICJzdWdnZXN0aW9uQ2FjaGUiLCAiYXBwZW5kVG9JbnNlcnRWYWx1ZSIsICJhcHBlbmQiLCAic3VnZ2VzdGlvbnMiLCAiaXRlbSIsICJrdlN1Z2dlc3Rpb25zVG9GaWdTdWdnZXN0aW9ucyIsICJpbml0IiwgIm91dCIsICJuYW1lIiwgImdldFN1Z2dlc3Rpb25zIiwgInVzZVN1Z2dlc3Rpb25DYWNoZSIsICJzaG91bGRVc2VDYWNoZSIsICJpc0tleSIsICJjYWNoZSIsICJsYXN0SW5kZXhPZiIsICJoYXlzdGFjayIsICJuZWVkbGVzIiwgIm5lZWRsZSIsICJyZW1vdmVSZXBlYXRTdWdnZXN0aW9ucyIsICJhbHJlYWR5VXNlZCIsICJzZWVuIiwgInN1Z2dlc3Rpb24iLCAiX2EiLCAidmFsdWVMaXN0IiwgImRlbGltaXRlciIsICJ2YWx1ZXMiLCAiaW5zZXJ0RGVsaW1pdGVyIiwgImFsbG93UmVwZWF0ZWRWYWx1ZXMiLCAibmV3VG9rZW4iLCAib2xkVG9rZW4iLCAidG9rZW4iLCAidG9rZW5zIiwgInZhbHVlc0luTGlzdCIsICJrZXlWYWx1ZSIsICJzZXBhcmF0b3IiLCAia2V5cyIsICJpbnNlcnRTZXBhcmF0b3IiLCAidXNlQ2FjaGUiLCAia2V5VmFsdWVMaXN0IiwgImFsbG93UmVwZWF0ZWRLZXlzIiwgIm5ld1Rva2VuSWR4IiwgIm9sZFRva2VuSWR4IiwgImluZGV4IiwgImZpbmFsVG9rZW4iLCAiZXhpc3RpbmdLZXlzIiwgImNodW5rIiwgImV4aXN0aW5nVmFsdWVzIiwgInJlcXVpcmVfYWkiLCAiX19jb21tb25KU01pbiIsICJleHBvcnRzIiwgIl9fYXdhaXRlciIsICJ0aGlzQXJnIiwgIl9hcmd1bWVudHMiLCAiUCIsICJnZW5lcmF0b3IiLCAiYWRvcHQiLCAidmFsdWUiLCAicmVzb2x2ZSIsICJyZWplY3QiLCAiZnVsZmlsbGVkIiwgInN0ZXAiLCAiZSIsICJyZWplY3RlZCIsICJyZXN1bHQiLCAiTUFYX1RPS0VOUyIsICJUT0tFTl9UT19DSEFSX1JBVElPIiwgIk1BUkdJTl9SQVRJTyIsICJNQVhfQ0hBUlMiLCAiYWkiLCAibmFtZSIsICJwcm9tcHQiLCAibWVzc2FnZSIsICJwb3N0UHJvY2VzcyIsICJ0ZW1wZXJhdHVyZSIsICJzcGxpdE9uIiwgInRva2VucyIsICJleGVjdXRlQ29tbWFuZCIsICJnZW5lcmF0b3JDb250ZXh0IiwgIl9hIiwgIl9iIiwgInNldHRpbmdPdXRwdXQiLCAicHJvbXB0U3RyaW5nIiwgIm1lc3NhZ2VTdHJpbmciLCAiYnVkZ2V0IiwgImJvZHkiLCAiYm9keUpzb24iLCAicmVxdWVzdE91dHB1dCIsICJqc29uIiwgImMiLCAicyIsICJvdXQiLCAidGV4dCIsICJyZXF1aXJlX2xpYiIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiX19jcmVhdGVCaW5kaW5nIiwgIm8iLCAibSIsICJrIiwgImsyIiwgImRlc2MiLCAiX19leHBvcnRTdGFyIiwgInAiLCAiZmlsZXBhdGhzXzEiLCAiYWlfMSIsICJpbXBvcnRfYXV0b2NvbXBsZXRlX2dlbmVyYXRvcnMiLCAiY29tcGxldGlvblNwZWMiLCAiZW52Y3RsX2RlZmF1bHQiXQp9Cg==
