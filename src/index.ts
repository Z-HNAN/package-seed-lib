import moduleA from './moduleA';

export default function hello(name: string): string {
  moduleA({ name: '1' });
  return `hello ${name}`;
}
