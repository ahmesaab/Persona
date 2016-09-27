import pymysql
import random
import string

users = 1000; # Create 1000 users
quizPerUser = range(10); # Each user has between 0 and 10 quizzes
questionPerQuiz = range(5,10,1); # Each quiz has between 5 & 10 questions
answersPerQuestion = 4; # Each question has 4 answers 1 of which is correct
solutionsPerQuiz = range(0,100); # Each quiz was solved between 0 and 100 times;

def randomword(length):
   return ''.join(random.choice(string.lowercase) for i in range(length))

conn = pymysql.connect(
	host='localhost',
	port=3306,
	user='root',
	passwd='admin123',
	db='personadb');

cur = conn.cursor();
cur2 = conn.cursor();

#Delete from all tables
cur.execute("DELETE FROM Answers");
cur.execute("DELETE FROM UserQuestionSolution");
cur.execute("DELETE FROM UserQuizSolution");
cur.execute("DELETE FROM Questions");
cur.execute("DELETE FROM Quizzes");
cur.execute("DELETE FROM Users");

print("DELETED FROM ALL TABLES!")

#Reseting Auto Incerements for all tables
cur.execute("ALTER TABLE Answers AUTO_INCREMENT = 1");
cur.execute("ALTER TABLE UserQuestionSolution AUTO_INCREMENT = 1");
cur.execute("ALTER TABLE UserQuizSolution AUTO_INCREMENT = 1");
cur.execute("ALTER TABLE Questions AUTO_INCREMENT = 1");
cur.execute("ALTER TABLE Quizzes AUTO_INCREMENT = 1");
cur.execute("ALTER TABLE Users AUTO_INCREMENT = 1");

print("RESETED AUTO_INCREMENT FOR ALL TABLES!")
print("INSERTING...");

#FOR LOOP MAIN
for i in range(users):
	cur.execute("INSERT INTO users(first_name,last_name,user_name) " +
		"VALUES ('"+randomword(8)+"', '"+randomword(8)+"', '"+randomword(8)+"');");
	user_id = cur.lastrowid;
	#FOR EVERY USER
	for j in range(random.choice(quizPerUser)):
		cur.execute("INSERT INTO quizzes(owner_user_id,name,description) " +
			"VALUES ("+str(user_id)+", '"+randomword(8)+"', '"+randomword(20)+"');");
		quiz_id = str(cur.lastrowid)

		#FOR EVERY QUIZ
		for t in range(random.choice(questionPerQuiz)):

			cur.execute("INSERT INTO questions(quiz_id,content,type) " +
				"VALUES ("+quiz_id+", '"+randomword(20)+"', "+str(random.choice(range(3)))+");")
			question_id = str(cur.lastrowid)

			random_correct_ans = random.choice(range(answersPerQuestion));
			#FOR EVERY QUESTION
			for t in range(answersPerQuestion):
				if(t==random_correct_ans):
					correct='(1)'
				else:
					correct='(0)'
				cur.execute("INSERT INTO answers(question_id,content,correct) " +
					"VALUES ("+question_id+",'"+randomword(14)+"',"+correct+");")

conn.commit();

# FOR EVERY QUIZ
cur2.execute("SELECT * FROM Quizzes")
for row in cur2:
	user_range = range(users);
	quiz = str(row[0]);
	for x in range(random.choice(solutionsPerQuiz)):
		user = random.choice(user_range)+1;
		user_range.remove(user-1);
		cur.execute("INSERT INTO userquizsolution(user_id,quiz_id,score) " +
			"VALUES ("+str(user)+","+quiz+","+str(random.choice(range(100)))+");")

print("DATABASE POPULATED!!");

cur.close()
cur2.close();
conn.commit()
conn.close()