SELECT distinct qz.name,qz.id,count(q.id) as 'Number of question/quiz',
(
select count(uqs.quiz_id) from userquizsolution uqs where qz.id = uqs.quiz_id 
)as 'user solved this quiz',
(
select  max(uqs.score) from userquizsolution uqs where qz.id = uqs.quiz_id 
)as 'Score of this quiz',(
SELECT user_name from users where id =  (  SELECT user_id from userquizsolution where qz.id=userquizsolution.quiz_id order by score DESC LIMIT 1 ))
from quizzes qz
INNER JOIN questions q 
ON q.quiz_id = qz.id and qz.owner_user_id=1
group by q.quiz_id;