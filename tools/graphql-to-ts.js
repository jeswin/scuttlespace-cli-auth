const gqlSchema = require("scuttlespace-service-user-graphql-schema");
const fromQuery = require("@gql2ts/from-query");

const generateSubTypeInterfaceName = () => null;

const root = `
  type Query {
    _nothing: String
  }

  type Mutation {
    _nothing: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

const eggs = `
enum Episode { NEWHOPE, EMPIRE, JEDI }
interface Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  anOldField: String @deprecated(reason: "Field No Longer Available.")
  nonNullArr: [Character]!
  nonNullArrAndContents: [Character!]!
  nullArrNonNullContents: [Character!]
}
type Human implements Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  homePlanet: String
  anOldField: String @deprecated(reason: "Field No Longer Available.")
  nonNullArr: [Character]!
  nonNullArrAndContents: [Character!]!
  nullArrNonNullContents: [Character!]
}
type Droid implements Character {
  id: String!
  name: String
  friends: [Character]
  appearsIn: [Episode]
  primaryFunction: String
  primaryFunctionNonNull: String!
  anOldField: String @deprecated(reason: "Field No Longer Available.")
  nonNullArr: [Character]!
  nonNullArrAndContents: [Character!]!
  nullArrNonNullContents: [Character!]
}
scalar TestScalar
union HumanOrDroid = Human | Droid
type Query {
  heroNoParam: Character
  hero(episode: Episode): Character
  human(id: String!): Human
  droid(id: String!): Droid
  test(test: TestScalar): TestScalar
  humanOrDroid(id: String!): HumanOrDroid
  getCharacters(ids: [ID!]!): [Character]!
  anOldField: String @deprecated(reason: "Field No Longer Available.")
}
extend type Query {
  getCharacters2(ids: [ID!]!): [Character]!
  _ddd: String
}
`

console.log(root + gqlSchema.typeDefs);

console.log(
  fromQuery.default(
    // root + gqlSchema.typeDefs,
    eggs,
    
    // `query BoomBoom ($domain: String) {
    //   _nothing
    //   }`
    `
    query TestQuery ($ids: [ID!]!) {
      getCharacters2 (ids: $ids) {
        id
        name
      }
    }
  `
  )
);
