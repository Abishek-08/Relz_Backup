list1 = [1,2,3,4]
list2 = ['a','b','c','d']

# using zip() function
combined_list = list(zip(list1,list2))

for x,y in combined_list:
    print(f'From list1: {x} || From list2: {y}')

# Inline for-loop using zip()
result = [str(x)+str(y) for x,y in combined_list]
print("Result: ",result)
