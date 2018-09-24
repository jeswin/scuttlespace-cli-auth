rm -rf dist
ts-node tools/generateQueries.ts > src/schemaTypes.ts
prettier --write src/schemaTypes.ts
tsc