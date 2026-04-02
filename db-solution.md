# db-solution

웹 공통강의 - DB에 대한 실습 내용을 담는다.

## 실습 문제

### DDL 실습

#### 문제 1: 테이블 생성하기 (CREATE TABLE)

1. attendance 테이블은 중복된 데이터가 쌓이는 구조이다. 중복된 데이터는 어떤 컬럼인가?

`crew_id`, `nickname` 컬럼이 중복된다. 같은 크루일 때 두 컬럼이 동일하다.

2. attendance 테이블에서 중복을 제거하기 위해 crew 테이블을 만들려고 한다. 어떻게 구성해 볼 수 있을까?

`crew_id`를 PK, `nickname`을 NOT NULL 컬럼으로 설정

3. crew 테이블에 들어가야 할 크루들의 정보는 어떻게 추출할까? (hint: DISTINCT)

```sql
SELECT DISTINCT crew_id, nickname FROM attendance;
/*
+---------+-----------+
| crew_id | nickname  |
+---------+-----------+
|       1 | 검프      |
|       2 | 구구      |
|       3 | 네오      |
|       4 | 브라운    |
|       5 | 브리      |
|       6 | 포비      |
|       7 | 워니      |
|       8 | 리사      |
|       9 | 제임스    |
|      10 | 류시      |
|      11 | 디노      |
|      12 | 시지프    |
+---------+-----------+
 */
```

4. 최종적으로 crew 테이블 생성:

```sql
CREATE TABLE crew (
  crew_id INT NOT NULL AUTO_INCREMENT,
  nickname VARCHAR(50) NOT NULL,
  PRIMARY KEY (crew_id)
);
```

5. attendance 테이블에서 크루 정보를 추출해서 crew 테이블에 삽입하기:

[The SQL INSERT INTO SELECT Statement](https://www.w3schools.com/sql/sql_insert_into_select.asp)

```sql
INSERT INTO crew
  SELECT  DISTINCT crew_id, nickname 
  FROM    attendance
  ORDER BY crew_id
;

SELECT * FROM crew;
/*
+---------+-----------+
| crew_id | nickname  |
+---------+-----------+
|       1 | 검프      |
|       2 | 구구      |
|       3 | 네오      |
|       4 | 브라운    |
|       5 | 브리      |
|       6 | 포비      |
|       7 | 워니      |
|       8 | 리사      |
|       9 | 제임스    |
|      10 | 류시      |
|      11 | 디노      |
|      12 | 시지프    |
+---------+-----------+
 */
```

##### 참고: `AUTO_INCREMENT` 컬럼에 값을 직접 지정해서 넣으면

내부적으로 다음 컬럼값이 무엇이 되어야 할 지 포인터를 가지는데, 이 값은 '넣었던 값 중 가장 큰 값 + 1'로 계산된다.

아래 예시를 보면 넣었던 값 중 가장 큰 것이 12인 상태에서 5를 강제로 넣고 난 뒤에, `AUTO_INCREMENT`를 이용해서 넣어보면 6이 아니라 13으로 삽입됨을 알 수 있다.

```sql
-- AUTO_INCREMENT 실험
CREATE TABLE crew
(
    crew_id  INT NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(50) NOT NULL,
    PRIMARY KEY (crew_id)
);

INSERT INTO crew(nickname)
VALUES ('가'),
       ('나')
;

INSERT INTO crew VALUES (10, '다');
INSERT INTO crew(nickname)
VALUES ('라'),
       ('마')
;

INSERT INTO crew VALUES (5, '바');
INSERT INTO crew(nickname)
VALUES ('사'),
       ('아')
;

SELECT * FROM crew ORDER BY nickname;
/*
 +---------+----------+
| crew_id | nickname |
+---------+----------+
|       1 | 가       |
|       2 | 나       |
|      10 | 다       |
|      11 | 라       |
|      12 | 마       |
|       5 | 바       |
|      13 | 사       |
|      14 | 아       |
+---------+----------+
 */
```

#### 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)

1. crew 테이블을 만들고 중복을 제거했다. attendance에서 불필요해지는 컬럼은?

crew 테이블의 PK인 `crew_id`만으로 `nickname`을 고유하게 찾을 수 있으므로 attendance에서는 `nickname`을 제거해야 한다.

2. 컬럼을 삭제하려면 어떻게 해야 하는가?

[SQL DROP COLUMN Keyword](https://www.w3schools.com/sql/sql_ref_drop_column.asp)

```sql
ALTER TABLE attendance
DROP COLUMN nickname;

SELECT * FROM attendance;
/*
 +---------------+---------+-----------------+------------+----------+
| attendance_id | crew_id | attendance_date | start_time | end_time |
+---------------+---------+-----------------+------------+----------+
|             1 |       1 | 2025-03-04      | 09:45:00   | 18:10:00 |
|             2 |       1 | 2025-03-05      | 09:50:00   | 18:05:00 |
|             3 |       1 | 2025-03-06      | 09:59:00   | 18:02:00 |
|             4 |       1 | 2025-03-07      | 10:00:00   | 18:05:00 |
|             5 |       1 | 2025-03-10      | 12:55:00   | 18:10:00 |
|             6 |       1 | 2025-03-11      | 09:58:00   | 18:03:00 |
|             7 |       1 | 2025-03-12      | 09:55:00   | 18:05:00 |
|             8 |       2 | 2025-03-04      | 10:01:00   | 18:01:00 |
...
 */
```

#### 문제 3: 외래키 설정하기

[SQL FOREIGN KEY Constraint](https://www.w3schools.com/sql/sql_foreignkey.asp)

**테이블 구조: FK 설정 전**

```sql
DESC attendance;
/*
+-----------------+------+------+-----+---------+----------------+
| Field           | Type | Null | Key | Default | Extra          |
+-----------------+------+------+-----+---------+----------------+
| attendance_id   | int  | NO   | PRI | NULL    | auto_increment |
| crew_id         | int  | NO   |     | NULL    |                |
| attendance_date | date | NO   |     | NULL    |                |
| start_time      | time | YES  |     | NULL    |                |
| end_time        | time | YES  |     | NULL    |                |
+-----------------+------+------+-----+---------+----------------+
 */
```

**테이블 구조: FK 설정 후**

```sql
ALTER TABLE Orders
ADD CONSTRAINT fk_Person
FOREIGN KEY (PersonID)
REFERENCES Persons(PersonID);

DESC attendance;
/*
+-----------------+------+------+-----+---------+----------------+
| Field           | Type | Null | Key | Default | Extra          |
+-----------------+------+------+-----+---------+----------------+
| attendance_id   | int  | NO   | PRI | NULL    | auto_increment |
| crew_id         | int  | NO   | MUL | NULL    |                |
| attendance_date | date | NO   |     | NULL    |                |
| start_time      | time | YES  |     | NULL    |                |
| end_time        | time | YES  |     | NULL    |                |
+-----------------+------+------+-----+---------+----------------+
 */
```

##### 왜 FK가 아니고, MUL이라고 표현될까?

[Understanding MySQL Keys: MUL, PRI, and UNI Explained](https://www.baeldung.com/sql/mysql-keys-mul-pri-uni)

PRIMARY KEY는 PRI라고 뜬다. 그런데 왜 FOREIGN KEY는 FORE...처럼 표현되지 않을까?

그 이유는 '어떤 키인지' 보다 '저장 규칙'을 표현해주기 위함이라고 한다.

따라서 FK는 해당 테이블에서 여러 row에 함께 존재할 수 있기 때문에, MUL(TIPLE)로 표현되는 것이다.

일단 모든 종류의 key는 인덱스가 생성된다. 이때 중복과 NULL 허용 여부에 따라 다음과 같이 표현된다. 

**테이블 Description에서 표현되는 키 종류**

| **구분**  | **이름**           | **중복 허용** | **NULL 허용** | **핵심 특징**                                 |
| ------- | ---------------- | --------- | ----------- | ----------------------------------------- |
| **PRI** | **Primary Key**  | X         | X           | 레코드를 유일하게 식별하는 **'주민등록번호'** 역할 (테이블당 1개)  |
| **UNI** | **Unique Key**   | X         | O           | 중복은 안 되지만, 값이 없을 순 있음 (아이디, 이메일 등)        |
| **MUL** | **Multiple Key** | O         | O           | 중복 데이터가 들어와도 되는 **일반 인덱스** (외래 키, 검색용 색인) |

#### 문제 4: 유니크 키 설정

[SQL UNIQUE Constraint](https://www.w3schools.com/sql/sql_unique.asp)

**테이블 구조: UNIQUE 설정 전**

```sql
DESC crew;
/*
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| crew_id  | int         | NO   | PRI | NULL    | auto_increment |
| nickname | varchar(50) | NO   |     | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
 */
```

**테이블 구조: UNIQUE 설정 후**

```sql
ALTER TABLE crew
ADD UNIQUE (nickname);

DESC crew;
/*
+----------+-------------+------+-----+---------+----------------+
| Field    | Type        | Null | Key | Default | Extra          |
+----------+-------------+------+-----+---------+----------------+
| crew_id  | int         | NO   | PRI | NULL    | auto_increment |
| nickname | varchar(50) | NO   | UNI | NULL    |                |
+----------+-------------+------+-----+---------+----------------+
 */
```

### DML(CRUD) 실습

#### 문제 5: 크루 닉네임 검색하기 (LIKE)

```sql
SELECT  nickname
FROM    crew
WHERE   nickname LIKE "디%";
/*
 +----------+
| nickname |
+----------+
| 디노     |
+----------+
 */
```

##### LIKE 검색과 인덱스

> [!todo]
> 
> 'SQL 첫걸음' 읽으면서 생각 정리한 글 옮기기

#### 문제 6: 출석 기록 확인하기 (SELECT + WHERE)

**방법 1. 서브 쿼리**

```sql
SELECT  *
FROM    attendance AS a
WHERE   a.crew_id = 
  (
    SELECT  crew_id
    FROM    crew
    WHERE   nickname = '어셔'
  )
;
```

**방법 2. LEFT JOIN (처음 생각한 방식)**

```sql
SELECT  c.nickname, a.attendance_date, a.start_time, a.end_time
FROM    attendance AS a, crew AS c
WHERE   a.attendance_date = '2025-03-06'
        && a.crew_id = c.crew_id
        && c.nickname = '어셔';
/*
Empty result
 */
```

**방법 2. LEFT JOIN (명시적 조인, `&&` 대신 `AND` 사용)**

```sql
SELECT    c.nickname, a.attendance_date, a.start_time, a.end_time
FROM      attendance AS a
LEFT JOIN crew AS c ON a.crew_id = c.crew_id
WHERE     a.attendance_date = '2025-03-06'
          AND c.nickname = '어셔';
/*
Empty result
 */
```

#### 문제 7: 누락된 출석 기록 추가 (INSERT)

애초에 '어셔'라는 크루가 DB에 존재하지 않는 상태이다.

**'어셔'를 crew에 추가**

```sql
INSERT INTO crew (nickname) VALUES ('어셔');

SELECT * FROM crew;
/*
+---------+-----------+
| crew_id | nickname  |
+---------+-----------+
|       1 | 검프      |
|       2 | 구구      |
|       3 | 네오      |
|      11 | 디노      |
|      10 | 류시      |
|       8 | 리사      |
|       4 | 브라운    |
|       5 | 브리      |
|      12 | 시지프    |
|      13 | 어셔      |
|       7 | 워니      |
|       9 | 제임스    |
|       6 | 포비      |
+---------+-----------+
 */
```

**'어셔'의 출석 기록을 추가**

```sql
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
(
  SELECT  crew_id, '2025-03-06', '09:31', '18:01'
  FROM    crew
  WHERE   nickname = '어셔'
);

SELECT  *
FROM    attendance
WHERE   crew_id =
        (
            SELECT crew_id FROM crew WHERE nickname = '어셔'
        );
/*
+---------------+---------+-----------------+------------+----------+
| attendance_id | crew_id | attendance_date | start_time | end_time |
+---------------+---------+-----------------+------------+----------+
|            76 |      13 | 2025-03-06      | 09:31:00   | 18:01:00 |
+---------------+---------+-----------------+------------+----------+
 */
```

#### 문제 8: 잘못된 출석 기록 수정 (UPDATE)

**데이터 세팅**

```sql
INSERT INTO crew (nickname) VALUES ('주니');

INSERT INTO attendance (crew_id, attendance_date, start_time)
(
  SELECT  crew_id, '2025-03-12', '10:05'
  FROM    crew
  WHERE   nickname = '주니'
);

SELECT  *
FROM    attendance
WHERE   crew_id =
(
  SELECT  crew_id
  FROM    crew
  WHERE   nickname = '주니'
)
/*
+---------------+---------+-----------------+------------+----------+
| attendance_id | crew_id | attendance_date | start_time | end_time |
+---------------+---------+-----------------+------------+----------+
|            77 |      14 | 2025-03-12      | 10:05:00   | NULL     |
+---------------+---------+-----------------+------------+----------+
 */
```

**데이터 수정**

```sql
UPDATE attendance
SET start_time = '10:00'
WHERE crew_id = (
    SELECT crew_id
    FROM crew
    WHERE nickname = '주니'
)
  AND attendance_date = '2025-03-12';

SELECT
    a.attendance_id,
    a.crew_id,
    c.nickname,
    a.attendance_date,
    a.start_time
FROM attendance AS a
INNER JOIN crew AS c
    ON a.crew_id = c.crew_id
WHERE c.nickname = '주니';
/*
+---------------+---------+----------+-----------------+------------+
| attendance_id | crew_id | nickname | attendance_date | start_time |
+---------------+---------+----------+-----------------+------------+
|            77 |      14 | 주니     | 2025-03-12      | 10:00:00   |
+---------------+---------+----------+-----------------+------------+
 */
```

#### 문제 9: 허위 출석 기록 삭제 (DELETE)

**데이터 세팅**

```sql
INSERT INTO crew (nickname)
VALUES ('아론');

INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
SELECT crew_id, '2025-03-12', '10:00', '18:00'
FROM crew
WHERE nickname = '아론';

SELECT *
FROM attendance
WHERE crew_id = (
  SELECT crew_id
  FROM crew
  WHERE nickname = '아론'
);
/*
+---------------+---------+-----------------+------------+----------+
| attendance_id | crew_id | attendance_date | start_time | end_time |
+---------------+---------+-----------------+------------+----------+
|            78 |      15 | 2025-03-12      | 10:00:00   | 18:00:00 |
+---------------+---------+-----------------+------------+----------+
 */
```

**데이터 삭제**

```sql
DELETE FROM attendance
WHERE crew_id = (
  SELECT crew_id
  FROM crew
  WHERE nickname = '아론'
)
AND attendance_date = '2025-03-12';

SELECT *
FROM attendance
WHERE crew_id = (
  SELECT crew_id
  FROM crew
  WHERE nickname = '아론'
);
/*
결과 없음
 */
```

## 알게 된 사실 정리

- SELECT 절에서 AS로 선언한 것을 WHERE 등에서 사용 가능한가? -> 원칙적으로는 실행 순서로 인해 안 되고, 8.0 버전부터는 lateral 떄문에 된다.
- [`INSERT INTO`에서 `SELECT` 활용하기](https://www.w3schools.com/sql/sql_insert_into_select.asp)
