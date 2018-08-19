rm -rf dist
node tools/graphql-to-ts.js > src/schemaTypes.ts
prettier --write src/schemaTypes.ts
tsc