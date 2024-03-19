import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from './createTestingModule';
import { appSetup } from './app.setup';
import { AuthResponse } from '../src/auth/dto/response-auth.dto';
import { RegisterDto } from '../src/auth/dto/register.dto';
import * as request from 'supertest';

describe('User related routes', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let authUser: AuthResponse;

  const authUserData: RegisterDto = {
    email: 'auth.user@email.com',
    password: 'q1230',
    username: 'Auth user',
  } as RegisterDto;

  it('/auth/register (POST) - success', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authUserData);

    expect(res.statusCode).toEqual(HttpStatus.CREATED);
    authUser = res.body;
  });

  it('/auth/register (POST) - error exists email', async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: authUserData.email,
      password: 'password_string',
      username: 'New user name',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/auth/login (POST) - success', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: authUserData.email,
      password: authUserData.password,
    });

    expect(res.statusCode).toEqual(HttpStatus.OK);
  });

  it('/auth/login (POST) - not found login', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'not_exists@email.com',
      password: 'any_password',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/auth/login (POST) - wrong password', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: authUserData.email,
      password: 'wrong_password',
    });

    expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/auth/login (POST) - with auth error', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authUserData.email,
        password: 'wrong_password',
      })
      .set('Authorization', 'Bearer ' + authUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });
});
