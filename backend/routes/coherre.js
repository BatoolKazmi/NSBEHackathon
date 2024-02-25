const readline = require('readline');

const { CohereClient } = require("cohere-ai");
const { resolve } = require('path');

const cohere = new CohereClient({
    token: "fJA1zCAkeey1ratll6W9fP8Dhdqjjo9OzMM7sv7t",
});

const getUserInput = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter Ingredients (comma separated): ', (ingredients) => {
            rl.close();
            resolve(ingredients);
        });
    })
};

const main = async () => {
    const apiKey = "fJA1zCAkeey1ratll6W9fP8Dhdqjjo9OzMM7sv7t";
    const cohere = new CohereClient({ token: apiKey });

    const ingredients = await getUserInput();

    const prompt = `Give me recipes with detailed instructions with only these ${ingredients} also attach links for reference`;

    // const generate = await cohere.generate({ prompt });
    const response = await cohere.chat({
        message: prompt
    });

    console.log(response);



};

// (async () => {
//   const generate = await cohere.generate({
//       prompt: "Give me recipes with potatoes, tomatoes and cauliflower",
//   });

//   console.log(generate);
// })();

main();