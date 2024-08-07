# CareerConnect
## Deploy link: 
## Technical:
- Back-end: Django Rest Framework
- Front-end: Reactjs, Tailwind
- Database: Postgres

#### Chi tiết version
- Python: 3.12
- Django: 5.0.7
- Django REST Framework: 3.15.2
- Node: 10.5.0
- React: 18.3.1

### Cài đặt và chạy project:
1. Cách cài đặt project:  
Require: Python, npm  
B1: Khởi tạo môi trường ảo (venv hoặc pipenv)  
B2: Mở terminal và chạy: pip install -r requirements.txt  
B3: Mở terminal và chạy:
	- cd career-connect
	- npm i  

    B4: Sử dụng pgAdmin 4 tạo 1 database mới.  
B5: Copy file .env.example và đổi tên thành .env và điền các thông tin cần thiết vào file
2. Cách chạy project:  
B1: Chạy BE: python manage.py runserver  
B2: Chạy FE: cd career-connect && npm start


### Features
#### Company
- Post jobs to seek candidates
- View posted jobs
- Edit job info, change job status
- View candidates who have applied
- Download resumes of candidates who have applied
- View candidate profiles
- Interact with candidates (chat, email)

#### Candidate
- Candidate profile, upload resumes, manage uploaded resumes
- View all jobs posted by companies
- Apply to jobs, upload resumes
- View company info
- Track applications (viewed/downloaded resumes)
- Interact with companies (chat, email)

#### Administrator
- Dashboard with an overview of the number of companies, candidates, and jobs in the system
- View all companies and candidates
- View all posted jobs
- Modify status/hide or delete companies/candidates/jobs  

