class Clz {
}

type ParamAPI = { name: string };
function foo(p: ParamAPI): void {
  console.log(p.name);
}

export {
  Clz,
  foo,
};
