import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET) should return app status', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200);
    });
  });

  describe('Auth Endpoints', () => {
    it('/auth/login (POST) should require email and password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({})
        .expect(400);
    });

    it('/auth/register (POST) should require valid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });
  });

  describe('Courses Endpoints', () => {
    it('/courses (GET) should return courses list', () => {
      return request(app.getHttpServer())
        .get('/courses')
        .expect(200);
    });

    it('/courses/published (GET) should return published courses', () => {
      return request(app.getHttpServer())
        .get('/courses/published')
        .expect(200);
    });
  });
});
