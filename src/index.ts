import moduleA from './moduleA';

export default function hello(name: string): string {
  const res = Promise.resolve(() => {
    console.log('use es6');
  });
  console.log(res);

  const str = 'abcd';
  console.log(str.includes('a'));

  return `hello ${name}`;
}
