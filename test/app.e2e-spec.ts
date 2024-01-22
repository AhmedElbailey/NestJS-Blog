import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

let userToken: string;
let adminToken: string;
let userData = {
  id: 0,
  name: 'Ahmed',
  username: 'Dola',
  email: 'ahmedelbialy148@gmail.com',
  password: '123456789',
};
let adminData = {
  id: 0,
  name: 'Admin',
  username: 'Admin',
  email: 'ahmedelbialy@gmail.com',
  password: '123456789',
};

// User Authentication ////////////////////////////////////////////////
describe('User Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should signup as a new user', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })
      .expect(201);
  });

  it('Should return 400 if user already exists while signing up', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      })
      .expect(400);
  });

  it('Should login in as an existing user', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(201)
      .then((res) => {
        userToken = res.body.access_token;
      });
  });

  it('Should return 404 if user does not exist while logging in', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'wrondEmail@gmail.com',
        password: userData.password,
      })
      .expect(404);
  });
});

// Admin Authentication ////////////////////////////////////////////////
describe('Admin Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should signup as a new admin', () => {
    return request(app.getHttpServer())
      .post('/users/admin/signup')
      .send({
        name: adminData.name,
        username: adminData.username,
        email: adminData.email,
        password: adminData.password,
      })
      .expect(201);
  });

  it('Should return 400 if admin already exists while signing up', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        name: adminData.name,
        username: adminData.username,
        email: adminData.email,
        password: adminData.password,
      })
      .expect(400);
  });

  it('Should login in as an existing admin', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: adminData.email,
        password: adminData.password,
      })
      .expect(201)
      .then((res) => {
        adminToken = res.body.access_token;
      });
  });

  it('Should return 404 if admin does not exist while logging in', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'wrondEmail@gmail.com',
        password: adminData.password,
      })
      .expect(404);
  });
});

// User Service ////////////////////////////////////////////////
describe('User Service', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should get all users Data', () => {
    return request(app.getHttpServer())
      .get('/users?page=1&limit=10')
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toBeGreaterThan(0);
      });
  });

  it('Should get all users Data by username', async () => {
    await request(app.getHttpServer())
      .get('/users?page=1&limit=10&username=' + userData.username)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toBeGreaterThan(0);
        const user = res.body.items[0];
        console.log(user.id);
        Object.assign(userData, user);
      });
    await request(app.getHttpServer())
      .get('/users?page=1&limit=10&username=' + adminData.username)
      .expect(200)
      .then((res) => {
        expect(res.body.items.length).toBeGreaterThan(0);
        const admin = res.body.items[0];
        console.log(admin.id);
        Object.assign(adminData, admin);
      });
  });

  it('Should get specific user Data', () => {
    return request(app.getHttpServer())
      .get('/users/' + userData.id)
      .expect(200)
      .set('Authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res.body.id).toBeDefined();
      });
  });

  it('Should upadate user Data', () => {
    return request(app.getHttpServer())
      .patch('/users/' + userData.id)
      .send({
        username: 'Elbialy',
      })
      .expect(200)
      .set('Authorization', `Bearer ${userToken}`)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toEqual('Elbialy');
      });
  });

  it('Should return 401 if not authorized when Read, Update user', async () => {
    await request(app.getHttpServer())
      .get('/users/' + userData.id)
      .set('Authorization', `Bearer wrong${userToken}`)
      .expect(401);

    await request(app.getHttpServer())
      .patch('/users/' + userData.id)
      .send({
        username: 'Elbialy',
      })
      .set('Authorization', `Bearer wrong${userToken}`)
      .expect(401);
  });

  it('Should return 403 "Forbidden" when Delete user', () => {
    return request(app.getHttpServer())
      .delete(`/users/${userData.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('Should return 403 "Forbidden" when update user role', () => {
    return request(app.getHttpServer())
      .put(`/users/${userData.id}/role`)
      .send({ role: 'admin' })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});

// Admin Service ////////////////////////////////////////////////
describe('Admin Service', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should update user role', () => {
    return request(app.getHttpServer())
      .put(`/users/${userData.id}/role`)
      .send({ role: 'admin' })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.role).toEqual('admin');
      });
  });

  it('Should delete user and admin', async () => {
    const deletedUser = await request(app.getHttpServer())
      .delete(`/users/${userData.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const deletedAdmin = await request(app.getHttpServer())
      .delete(`/users/${adminData.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
