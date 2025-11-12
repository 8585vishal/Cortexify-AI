// Comprehensive Chat Functionality Test Suite
// Using built-in fetch (Node.js 18+) or global fetch

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

class ChatTester {
  constructor() {
    this.testResults = [];
    this.passed = 0;
    this.failed = 0;
  }

  async testHealthEndpoint() {
    console.log('🧪 Testing Health Endpoint...');
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      const data = await response.json();
      
      if (response.status === 200 && data.status === 'ok') {
        console.log('✅ Health check passed');
        this.passed++;
        this.testResults.push({ test: 'Health Endpoint', status: 'PASS', details: data });
        return true;
      } else {
        console.log('❌ Health check failed');
        this.failed++;
        this.testResults.push({ test: 'Health Endpoint', status: 'FAIL', details: data });
        return false;
      }
    } catch (error) {
      console.log('❌ Health check error:', error.message);
      this.failed++;
      this.testResults.push({ test: 'Health Endpoint', status: 'ERROR', details: error.message });
      return false;
    }
  }

  async testChatEndpoint() {
    console.log('🧪 Testing Chat Endpoint...');
    try {
      const messages = [
        { role: 'user', content: 'Hello, this is a test message' }
      ];

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      if (response.status === 200) {
        console.log('✅ Chat endpoint responded');
        
        // Test streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let chunks = [];
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          chunks.push(chunk);
          console.log('📨 Received chunk:', chunk.slice(0, 100) + '...');
        }
        
        this.passed++;
        this.testResults.push({ 
          test: 'Chat Endpoint', 
          status: 'PASS', 
          details: `Received ${chunks.length} chunks` 
        });
        return true;
      } else {
        console.log('❌ Chat endpoint failed with status:', response.status);
        this.failed++;
        this.testResults.push({ 
          test: 'Chat Endpoint', 
          status: 'FAIL', 
          details: `Status: ${response.status}` 
        });
        return false;
      }
    } catch (error) {
      console.log('❌ Chat endpoint error:', error.message);
      this.failed++;
      this.testResults.push({ test: 'Chat Endpoint', status: 'ERROR', details: error.message });
      return false;
    }
  }

  async testStreamingResponse() {
    console.log('🧪 Testing Streaming Response...');
    try {
      const messages = [
        { role: 'user', content: 'Tell me a very short joke' }
      ];

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let tokens = [];
      let hasData = false;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data !== '[DONE]') {
              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  tokens.push(parsed.token);
                  hasData = true;
                }
              } catch (e) {
                // Ignore parsing errors for keepalive messages
              }
            }
          }
        }
      }
      
      if (hasData && tokens.length > 0) {
        console.log('✅ Streaming response working, received', tokens.length, 'tokens');
        this.passed++;
        this.testResults.push({ 
          test: 'Streaming Response', 
          status: 'PASS', 
          details: `Received ${tokens.length} tokens` 
        });
        return true;
      } else {
        console.log('❌ No streaming data received');
        this.failed++;
        this.testResults.push({ 
          test: 'Streaming Response', 
          status: 'FAIL', 
          details: 'No tokens received' 
        });
        return false;
      }
    } catch (error) {
      console.log('❌ Streaming response error:', error.message);
      this.failed++;
      this.testResults.push({ test: 'Streaming Response', status: 'ERROR', details: error.message });
      return false;
    }
  }

  async testErrorHandling() {
    console.log('🧪 Testing Error Handling...');
    try {
      // Test with invalid API key
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.status === 200) {
        // Check if error is properly handled in streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let hasError = false;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          if (chunk.includes('error')) {
            hasError = true;
          }
        }
        
        if (hasError) {
          console.log('✅ Error handling working');
          this.passed++;
          this.testResults.push({ test: 'Error Handling', status: 'PASS', details: 'Error properly handled' });
          return true;
        } else {
          console.log('❌ Error handling not working properly');
          this.failed++;
          this.testResults.push({ test: 'Error Handling', status: 'FAIL', details: 'No error handling detected' });
          return false;
        }
      } else {
        console.log('✅ Error properly returned with status:', response.status);
        this.passed++;
        this.testResults.push({ test: 'Error Handling', status: 'PASS', details: `Status: ${response.status}` });
        return true;
      }
    } catch (error) {
      console.log('❌ Error handling test error:', error.message);
      this.failed++;
      this.testResults.push({ test: 'Error Handling', status: 'ERROR', details: error.message });
      return false;
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST EXECUTION REPORT');
    console.log('='.repeat(60));
    
    this.testResults.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.status}`);
      if (result.details) {
        console.log(`   Details: ${JSON.stringify(result.details)}`);
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`📈 Summary: ${this.passed}/${this.passed + this.failed} tests passed`);
    console.log(`🎯 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
    
    return {
      total: this.passed + this.failed,
      passed: this.passed,
      failed: this.failed,
      successRate: (this.passed / (this.passed + this.failed)) * 100,
      results: this.testResults
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Cortexify Chat Functionality Tests\n');
    
    await this.testHealthEndpoint();
    await this.testChatEndpoint();
    await this.testStreamingResponse();
    await this.testErrorHandling();
    
    const report = this.generateReport();
    
    // Save report to file
    const fs = require('fs');
    fs.writeFileSync('test_reports/chat_functionality_test.json', JSON.stringify(report, null, 2));
    
    console.log('\n💾 Test report saved to: test_reports/chat_functionality_test.json');
    
    return report;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ChatTester();
  tester.runAllTests().then(report => {
    process.exit(report.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = ChatTester;