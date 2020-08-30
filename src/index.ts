import moduleA from './moduleA';

export default function hello(name: string): string {
  const res = Promise.resolve(() => {
    console.log('use es6');
  });
  console.log(res);

  return `hello ${name}`;
}
