export const fetchUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = await response.json();
    console.log("User Info:", userInfo);

    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

export const checkIfCICSStudent = (email: string) => {
    try{

        let prefix = email.split('@')[0];
        let prefixSplit = prefix.split('.');
        let college = prefixSplit[prefixSplit.length - 1];

        return college === 'cics';

    }catch (error){
        console.error("Error with checking email:", error);
    }
}

export const checkIfCICSTAS = async (email: string) => {
    try{

        // POST /api/tas/email 
        let rqBody = JSON.stringify({email})// {email: email}

        let response = await fetch("http://localhost:8080/departmentchair/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: rqBody
        })

        let jsRes = await response.json();

        return jsRes.auth;

    }catch (error){
        console.error("Error with checking email: ", error);
    }
}

export const checkIfCICSDepartmentChair = async (email: string) => {
    try{

        return true;

        // POST /api/department-chair/email 
        // {email: email}

        // return true if may return ung query false if wala
        // SELECT id FROM department_chairs WHERE email = 'email'

        return true;

        let rqBody = JSON.stringify({email})// {email: email}

        let response = await fetch("http://localhost:8080/departmentchair/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: rqBody
        })

        let jsRes = await response.json();

        return jsRes.auth;

    }catch (error){
        console.error("Error with checking email: ", error);
    }
}

export const getCourseCodesFromInternalRepresentation = (internalRep: String[]) => {

    // loop thru the string arr
    // remove ung mga -LC -LB sa dulo tapos gawing set - para sa may mga lab
    // remove ung mga W- sa unahan - para sa mga specialization - lagyan ng (Specialization) - dont kasi sa front end may difference din dapat

    // return the set
    let removedLCandLb = internalRep.map((r) => {
        if (r.endsWith('-LC') || r.endsWith('-LB')){
            return r.slice(0, r.length - 3)
        }
        return r;
    })

    return Array(...new Set(removedLCandLb))

}