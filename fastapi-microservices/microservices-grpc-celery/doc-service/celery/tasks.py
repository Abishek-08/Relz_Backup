from worker import celery_app

@celery_app.task
def calculate_odd_even(numberList:list):
    oddList = []
    evenList = []
    import time
    for i in numberList:
        if i%2 == 0:
            evenList.append(i)
        else:
            oddList.append(i)
    time.sleep(10)
    return oddList