# python 3.12 lambda base image
FROM public.ecr.aws/lambda/python:3.12

# copy over the python requirements
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# install dependencies
RUN pip3 install -r requirements.txt

# copy function code to container
COPY app.py ${LAMBDA_TASK_ROOT}

# setting the CMD to the handler - file_name.function_name
CMD ["app.handler"]