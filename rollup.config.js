import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path';
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const resolve = function (...args) {
  return path.resolve(__dirname, ...args);
};

function toHump(str) {
  return str.replace(/\-(\w)/g, (matchedStr, firstLetter) => {
    return firstLetter.toUpperCase();
  })
};
const MATCHED_NAME = pkg.name.match(/^@.*\/(.+)$/);
const PKG_NAME = (MATCHED_NAME && MATCHED_NAME[1]) || pkg.name;
const umdName = toHump(PKG_NAME);

const extensions = ['.js', '.ts']
const noDeclarationFiles = { compilerOptions: { declaration: false } }

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(
  /^[^0-9]*/,
  ''
)

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return id => pattern.test(id)
}

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: resolve(pkg.main),
      format: 'cjs',
      exports: 'auto',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ useTsconfigDeclarationDir: true }),
      babel({
        extensions,
        plugins: [
          ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
        ],
        babelHelpers: 'runtime'
      })
    ]
  },

  // ES
  {
    input: 'src/index.ts',
    output: {
      file: resolve(pkg.module),
      format: 'es',
      exports: 'auto',
      indent: false
    },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ]),
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            { version: babelRuntimeVersion, useESModules: true }
          ],
        ],
        babelHelpers: 'runtime'
      })
    ]
  },

  // ES for Browsers
  {
    input: 'src/index.ts',
    output: {
      file: resolve(pkg.module.replace(/(.\w+)$/, '.min$1')),
      format: 'es',
      exports: 'auto',
      indent: false
    },
    plugins: [
      nodeResolve({
        extensions
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled'
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  },

  // UMD Development
  {
    input: 'src/index.ts',
    output: {
      file: resolve(pkg.unpkg),
      format: 'umd',
      name: umdName,
      indent: false
    },
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]
  },

  // UMD Production
  {
    input: 'src/index.ts',
    output: {
      file: resolve(pkg.unpkg.replace(/(.\w+)$/, '.min$1')),
      format: 'umd',
      name: umdName,
      indent: false
    },
    plugins: [
      nodeResolve({
        extensions
      }),
      typescript({ tsconfigOverride: noDeclarationFiles }),
      babel({
        extensions,
        exclude: 'node_modules/**',
        skipPreflightCheck: true,
        babelHelpers: 'bundled'
      }),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false
        }
      })
    ]
  }
]