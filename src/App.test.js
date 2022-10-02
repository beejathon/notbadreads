import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App.js'

describe("App", () => {
  // beforeEach(() => {
  //   jest.spyOn(global, "fetch").mockResolvedValue({
  //     json: jest.fn().mockResolvedValue(mockResponse)
  //   });
  // });
  
  // afterEach(() => {
  //   jest.restoreAllMocks();
  // });

  it("renders home page feed", async () => {
    await act(async () => {
      render(<App />);
    })
   
    // const title = screen.getByText("not bad book")
    // const author0 = screen.getByText("good author")
    // const author1 = screen.getByText("not bad author")
    // expect(title.textContent).toBe("not bad book")
    // expect(author0.textContent).toBe("good author")
    // expect(author1.textContent).toBe("not bad author")
  });
})