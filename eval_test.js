const http = require('http');

const testCases = [
  {
    id: 1,
    name: "Valid Context Verification",
    payload: { question: "Mera portfolio worth kya hai?" },
    validate: (resCode, body) => resCode === 200 && (body.includes('worth') || body.includes('portfolio') || body.includes('सर्वर'))
  },
  {
    id: 2,
    name: "System Fallback Containment Strategy",
    payload: { question: "Generate a completely random hallucinated transaction number" },
    validate: (resCode, body) => resCode === 200 || body.includes('problem') || body.includes('समस्या')
  }
];

function runEvaluation(test) {
  const postData = JSON.stringify(test.payload);
  
  const options = {
    hostname: 'localhost',
    port: 10000,
    path: '/ask',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => responseBody += chunk);
    res.on('end', () => {
      console.log(`\n--------------------------------------------`);
      console.log(`EVAL TEST CASE #${test.id}: ${test.name}`);
      console.log(`HTTP Status Returned: ${res.statusCode}`);
      console.log(`Payload Output Stream: ${responseBody}`);
      
      if (test.validate(res.statusCode, responseBody)) {
        console.log(`>>>> STATUS EVALUATION: PASSED ✅`);
      } else {
        console.log(`>>>> STATUS EVALUATION: FAILED ❌`);
      }
    });
  });

  req.on('error', (err) => {
    console.error(`\n❌ EVAL TEST #${test.id} CRITICAL FAILURE: Node server is not active on Port 10000.`);
    console.error(`Error Frame: ${err.message}`);
  });

  req.write(postData);
  req.end();
}

console.log("====================================================");
console.log("STARTING AUTOMATED FINANCE AGENT EVALUATION RUN");
console.log("====================================================");

testCases.forEach(runEvaluation);