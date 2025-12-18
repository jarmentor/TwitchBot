import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import crypto from "crypto";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import app, { connectDB, closeDB } from "../app.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  process.env.SECRET_KEY = crypto.randomBytes(32).toString("hex");
  await connectDB(`${uri}twitchbot`);
});

afterAll(async () => {
  await closeDB();
  await mongo.stop();
});

describe("Server", () => {
  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/users/register").send({
        username: "testuser",
        email: "test@test.com",
        password: "testpassword",
      });
      if (res.statusCode !== 201) {
        console.log("Register error:", res.body);
      }
      expect(res.statusCode).toEqual(201);
    });

    it("should return an error for duplicate username", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ username: "testuser", password: "testpassword" });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe("POST /login", () => {
    it("should log in a user", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser", password: "testpassword" });
      expect(res.statusCode).toEqual(200);
    });

    it("should return an error for invalid credentials", async () => {
      const res = await request(app)
        .post("/api/users/login")
        .send({ username: "invaliduser", password: "invalidpassword" });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe("POST /logout", () => {
    it("should log out a user", async () => {
      const res = await request(app).post("/api/users/logout");
      expect(res.statusCode).toEqual(200);
    });
  });
});
