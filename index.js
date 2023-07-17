import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Import data
import data from "./data.js";

// Import schema
import { typeDefs } from "./schema.js";

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
	Query: {
		games() {
			return data.games;
		},
		game(_, args) {
			return data.games.find((game) => game.id === args.id);
		},
		authors() {
			return data.authors;
		},
		author(_, args) {
			return data.authors.find((author) => author.id === args.id);
		},
		reviews() {
			return data.reviews;
		},
		review(_, args) {
			return data.reviews.find((review) => review.id === args.id);
		},
	},
	Game: {
		reviews(parent) {
			return data.reviews.filter((r) => r.game_id === parent.id);
		},
	},
	Author: {
		reviews(parent) {
			return data.reviews.filter((a) => a.author_id === parent.id);
		},
	},
	Review: {
		author(parent) {
			return data.authors.find((a) => a.id === parent.author_id);
		},
		game(parent) {
			return data.games.find((g) => g.id === parent.game_id);
		},
	},
	Mutation: {
		addGame(_, args) {
			let game = {
				...args.game,
				id: Math.floor(Math.random() * 1000).toString(),
			};
			data.games.push(game);
			return game;
		},
		updateGame(_, args) {
			data.games = db.games.map((g) => {
				if (g.id === args.id) {
					return { ...g, ...args.edits };
				}
				return g;
			});

			return data.games.find((g) => g.id === args.id);
		},
		deleteGame(_, args) {
			data.games = data.games.filter((g) => g.id !== args.id);
			return data.games;
		},
	},
};

// The ApolloServer constructor requires two parameters
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the startStandaloneServer function
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`Server started on port 4000...`);
