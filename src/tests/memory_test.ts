import {
   APIError,
   ISession,
   Memory,
   Message,
   NotFoundError,
   Session,
   Summary,
   ZepClient,
} from "../";
import { FetchMock } from "jest-fetch-mock";

const BASE_URL = "http://localhost:8000";

const fetchMock = global.fetch as FetchMock;

describe("ZepClient", () => {
   let client: ZepClient;

   beforeEach(async () => {
      fetchMock.resetMocks();
      client = await ZepClient.init(BASE_URL, "test-api-key");
   });

   describe("ZepClient Session", () => {
      it("retrieves the correct session when sessionId is provided", async () => {
         const expectedSessionId = "test-session";
         const expectedSessionData: ISession = {
            uuid: "uuid",
            created_at: "2022-01-01T00:00:00Z",
            updated_at: "2022-01-01T00:00:00Z",
            session_id: expectedSessionId,
            metadata: {},
         };

         fetchMock.mockResponseOnce(JSON.stringify(expectedSessionData));

         const session = await client.memory.getSession(expectedSessionId);

         expect(session.toDict()).toEqual(expectedSessionData);
      });
   });

   describe("ZepClient Session", () => {
      it("adds a session correctly when valid session data is provided", async () => {
         const expectedSessionId = "test-session";
         const sessionData: ISession = {
            session_id: expectedSessionId,
            metadata: { foo: "bar" },
         };
         const session = new Session(sessionData);
         const expectedResponseText = "Session added successfully";

         fetchMock.mockResponseOnce(expectedResponseText);

         const responseText = await client.memory.addSession(session);

         expect(responseText).toEqual(expectedResponseText);
      });
   });

   // Test Suite for getMemory()
   describe("getMemory", () => {
      // Test for retrieving memory for a session
      it("should retrieve memory for a session", async () => {
         const responseData = {
            messages: [{ role: "human", content: "Hello" }],
            summary: {
               uuid: "",
               created_at: "",
               content: "Memory summary",
               recent_message_uuid: "",
               token_count: 0,
            },
         };

         fetchMock.mockResponseOnce(JSON.stringify(responseData));

         const memory = await client.memory.getMemory("test-session");

         expect(memory).toEqual(
            new Memory({
               messages: [new Message({ role: "human", content: "Hello" })],
               summary: new Summary({
                  content: "Memory summary",
                  created_at: "",
                  recent_message_uuid: "",
                  token_count: 0,
                  uuid: "",
               }),
               metadata: {},
            })
         );
      });
   });

   // Test for throwing NotFoundError if the session is not found
   it("should throw NotFoundError if the session is not found", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

      await expect(client.memory.getMemory("test-session")).rejects.toThrow(
         NotFoundError
      );
   });

   // Test for returning a Memory object with empty messages when no messages are found
   it("should return a Memory object with empty messages when no messages are found", async () => {
      const responseData = {
         messages: [],
         summary: {
            uuid: "",
            created_at: "",
            content: "",
            recent_message_uuid: "",
            token_count: 0,
         },
      };

      fetchMock.mockResponseOnce(JSON.stringify(responseData));

      const memory = await client.memory.getMemory("test-session");

      expect(memory).toEqual(
         new Memory({
            messages: [],
            summary: new Summary({
               content: "",
               created_at: "",
               recent_message_uuid: "",
               token_count: 0,
               uuid: "",
            }),
            metadata: {},
         })
      );
   });

   // Test for throwing APIError when unexpected status code is returned
   it("should throw APIError when unexpected status code is returned", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

      await expect(client.memory.getMemory("test-session")).rejects.toThrow(
         APIError
      );
   });

   // Test for retrieving last 'n' memories for a session when 'lastn' parameter is used
   it("should retrieve last 'n' memories for a session when 'lastn' parameter is used", async () => {
      const responseData = {
         messages: [
            { role: "system", content: "How can I assist you?" },
            { role: "human", content: "What's the weather like?" },
         ],
         summary: {
            uuid: "",
            created_at: "",
            content: "Memory summary",
            recent_message_uuid: "",
            token_count: 0,
         },
      };

      // Mock fetch call with specific URL and parameters
      fetchMock.mockIf(
         (req) =>
            req.url.startsWith(
               `${BASE_URL}/api/v1/sessions/test-session/memory`
            ) && req.url.includes("lastn=2"),
         JSON.stringify(responseData)
      );

      const memory = await client.memory.getMemory("test-session", 2);

      expect(memory).toEqual(
         new Memory({
            messages: [
               new Message({
                  role: "system",
                  content: "How can I assist you?",
               }),
               new Message({
                  role: "human",
                  content: "What's the weather like?",
               }),
            ],
            summary: new Summary({
               uuid: "",
               created_at: "",
               content: "Memory summary",
               recent_message_uuid: "",
               token_count: 0,
            }),
            metadata: {},
         })
      );
   });

   // Test Suite for addMemory()
   describe("addMemory", () => {
      it("should add a memory to a session", async () => {
         const memoryData = new Memory({
            messages: [new Message({ role: "human", content: "Hello again!" })],
            summary: new Summary({
               uuid: "",
               created_at: "",
               content: "Memory summary",
               recent_message_uuid: "",
               token_count: 0,
            }),
            metadata: {},
         });

         fetchMock.mockResponseOnce("OK");

         const result = await client.memory.addMemory(
            "test-session",
            memoryData
         );

         expect(result).toEqual("OK");
      });

      // Test for throwing Error if the error response
      it("should throw APIError if !200 OK", async () => {
         const memoryData = new Memory({
            messages: [
               new Message({ role: "system", content: "System message" }),
            ],
            summary: new Summary({
               uuid: "summary_uuid",
               created_at: "2023-01-01T00:00:00Z",
               content: "Memory summary",
               recent_message_uuid: "recent_message_uuid",
               token_count: 0,
            }),
            metadata: {},
         });

         // Mock a status code that is unexpected (500 in this case)
         fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

         await expect(
            client.memory.addMemory("test-session", memoryData)
         ).rejects.toThrow(APIError);
      });
   });

   // Test Suite for deleteMemory()
   describe("deleteMemory", () => {
      // Test for deleting memory for a session
      it("should delete memory for a session", async () => {
         const message = "Memory deleted";

         fetchMock.mockResponseOnce(message);

         const response = await client.memory.deleteMemory("test-session");

         expect(response).toEqual(message);
      });

      // Test for throwing NotFoundError if the session is not found
      it("should throw NotFoundError if the session is not found", async () => {
         fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

         await expect(
            client.memory.deleteMemory("test-session")
         ).rejects.toThrow(NotFoundError);
      });

      // Test for throwing APIError when unexpected status code is returned
      it("should throw APIError when unexpected status code is returned", async () => {
         fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

         await expect(
            client.memory.deleteMemory("test-session")
         ).rejects.toThrow(APIError);
      });
   });

   // Test Suite for searchMemory()
   describe("searchMemory", () => {
      // Test for searching memory for a session
      it("should search memory for a session", async () => {
         const searchPayload = {
            metadata: {
               where: {
                  jsonpath: '$.system.entities[*] ? (@.Label == "WORK_OF_ART")',
               },
            },
            text: "system message",
         };

         const responseData = [
            {
               message: {
                  role: "system",
                  content: "system message",
                  uuid: "message_uuid",
                  created_at: "2023-01-01T00:00:00Z",
               },
               dist: undefined,
               summary: undefined,
               metadata: {},
            },
         ];

         fetchMock.mockResponseOnce(JSON.stringify(responseData));

         const searchResults = await client.memory.searchMemory(
            "test-session",
            searchPayload
         );

         expect(searchResults).toEqual(responseData);
      });

      // Test for throwing NotFoundError if the session is not found
      it("should throw NotFoundError if the session is not found", async () => {
         const searchPayload = {
            query: "system",
            metadata: { metadata_key: "metadata_value" }, // Replace with actual meta
            text: "search text", // Replace with actual text
         };

         fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });

         await expect(
            client.memory.searchMemory("test-session", searchPayload)
         ).rejects.toThrow(NotFoundError);
      });

      // Test for throwing APIError when unexpected status code is returned
      it("should throw APIError when unexpected status code is returned", async () => {
         const searchPayload = {
            query: "system",
            metadata: { metadata_key: "metadata_value" }, // Replace with actual meta
            text: "search text", // Replace with actual text
         };

         fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

         await expect(
            client.memory.searchMemory("test-session", searchPayload)
         ).rejects.toThrow(APIError);
      }); // end it
   }); // end describe
});