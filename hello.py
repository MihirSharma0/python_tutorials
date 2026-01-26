n1=int(input("Enter 1st number = "))
n2=int(input("Enter the 2nd number = "))
n3=int(input("Enter the 3rd number = ")) 
if n1>=n2>=n3:
    print("The sorted list is = ",n3,n2,n1)
elif n3>=n2>=n1:
    print("The sorted list is = ",n1,n2,n3)
elif n2>=n1>=n3:
    print("The sorted list is = ",n3,n1,n2)

        