const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../index");
const users = require("../models/users/Users");


describe("Route /users tests", () => {
  beforeEach(async () => {
    await users.deleteMany({});
  });
  test("It return a 200 status code when it create a new user", async () => {
    jest.setTimeout(30000);
    await request(app)
      .post("/api/users")
      .send({ email: "user@user.com", name: "user", password: "123456" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
  });

  test("It return a 403 status code when post a new user with empty data in any or all fields", async () => {
    await request(app)
      .post("/api/users")
      .send({ email: "", name: "", password: "" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(403);
  });

  //   test("It return a 404 status code when the user has been registered", async () => {
  //     jest.setTimeout(30000);
  //     await request(app)
  //       .post("/api/users")
  //       .send({ email: "user@user.com", name: "user", password: "123456" })
  //       .set("Accept", "application/json")
  //       .expect("Content-Type", /json/)
  //       .expect(200);
  //   });

  afterAll((done) => {
    mongoose.connection.close();
    server.close();
    done()
  });
});

describe("Route /auth tests", () => {
  let access_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MGUwYjc5MDFmMzU5OTg5YzRhNjZlYjEiLCJuYW1lIjoidXNlciIsImVtYWlsIjoidXNlcjFAdXNlci5jb20iLCJpYXQiOjE2MjU4NjIzOTQsImV4cCI6MTYyNTg5MTE5NH0.-i3h-dWWyVPZZZIPWH3pWvVmLC5UCVVN8P24cbHuMJ0";
  test("It return a token ", () => {
    request(app)
      .post("/api/auth")
      .set("Accept", "application/json")
      .send({ email: "user1@user.com", password: "123456" })
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("It return a user, when send a valid token", async () => {
    await request(app)
      .get("/api/auth")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + access_token)
      .expect("Content-Type", /json/)
      .expect(200, {
        user: {
          uid: "60e0b7901f359989c4a66eb1",
          name: "user",
          email: "user1@user.com",
          iat: 1625862394,
          exp: 1625891194,
        },
      });
  });

  afterAll((done) => {
    mongoose.connection.close();
    server.close();
    done()
  });
});

// describe("Route /links tests", () => {});
// describe("Route /files tests", () => {});
