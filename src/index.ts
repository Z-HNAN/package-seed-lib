import * as moduleA from './moduleA';

function hello(name: string): string {
  return `hello ${name}`;
}

export {
  moduleA,
  hello,
};
