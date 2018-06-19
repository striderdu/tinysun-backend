# tinysun


## 表结构

+ users

| id | username | password | role |
|:--:|:--------:|:--------:|:----:|
|  1 |    dht   |    dht   |   1  |

+ students

| student_id |   name  | teacher_id | finished |
|:----------:|:-------:|:----------:|:--------:|
|      1     | strider |      7     |     0    |

+ problems

| teacher_id | problem | total |
|:----------:|:-------:|:-----:|
|      7     |   1+1   |   1   |

## 接口描述

root: http://39.105.8.165:3000

### POST /login-check

+ @reqParam:
    - username string 
    - password string

+ @resParam:
    - status integer
    - id integer (teacher required)



```python
return status
-1: login error
1: login by student
2: login by teacher
```

### GET /teacher?id=something

+ @reqParam: 
    - teacher_id integer
+ @resParam:
    - stu{
        student_id
        name 
        teacher_id:
        finished:
    } array
    - prob{
        problem:
        total:
    } array

```json
{
    "stu":[{
        "student_id":3,
        "name":"myz",
        "teacher_id":6,
        "finished":0
        },{
        "student_id":4,
        "name":"zgq",
        "teacher_id":6,
        "finished":0
        },{
        "student_id":5,
        "name":"lxr",
        "teacher_id":6,
        "finished":0
    }],
    "prob":[{
        "problem":"111",
        "total":0
    }]
}
```

### GET /student?id=something

+ @reqParam: 
    - student_id integer
+ @resParam:
    - problems 

### POST /upload-grade

+ @reqParam: 
    - id
    - finished(本次已完成的题数)
+ @resParam:
    - status

```python
return status
0: error
1: success
```

### POST /upload-problems

+ @reqParam: 
    - id
    - problems
    - num
+ @resParam:
    - status

```python
return status
0: error
1: success
```