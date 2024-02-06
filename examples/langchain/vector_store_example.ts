import { ZepClient } from "../../src";
import { ChatOpenAI } from "@langchain/openai";
import {
   BasePromptTemplate,
   ChatPromptTemplate,
   PromptTemplate,
} from "@langchain/core/prompts";
import { ZepVectorStore } from "../../src/langchain";
import { Document } from "@langchain/core/documents";
import {
   RunnableMap,
   RunnableLambda,
   RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocument } from "../../src/langchain";

const DEFAULT_DOCUMENT_PROMPT = PromptTemplate.fromTemplate("{pageContent}");

async function combineDocuments(
   docs: Document[],
   documentPrompt: BasePromptTemplate = DEFAULT_DOCUMENT_PROMPT,
   documentSeparator: string = "\n\n",
) {
   const docStrings: string[] = await Promise.all(
      docs.map((doc) => {
         return formatDocument(doc, documentPrompt);
      }),
   );
   return docStrings.join(documentSeparator);
}
async function main() {
   const zepClient = await ZepClient.init(process.env.ZEP_API_KEY);
   const vectorStore = await ZepVectorStore.init({
      client: zepClient,
      collectionName: "leobernstein",
   });

   const prompt = ChatPromptTemplate.fromMessages([
      [
         "system",
         `Answer the question based only on the following context: {context}`,
      ],
      // new MessagesPlaceholder("history"),
      ["human", "{question}"],
   ]);

   const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-3.5-turbo-1106",
   });
   const retriever = vectorStore.asRetriever();

   const setupAndRetrieval = RunnableMap.from({
      context: new RunnableLambda({
         func: (input: string) =>
            retriever.invoke(input).then((response) => response[0].pageContent),
      }).withConfig({ runName: "contextRetriever" }),
      question: new RunnablePassthrough(),
   });
   const outputParser = new StringOutputParser();

   const chain = setupAndRetrieval.pipe(prompt).pipe(model).pipe(outputParser);

   const result = await chain.invoke("who is the famous american conductor?");

   console.log("result", result);
}

main();
