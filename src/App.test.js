import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

describe("Search List", () => {
  const mockResponse = {
    items: [
      {
        volumeInfo: {
          title: "good book",
          authors: {
            0: "good author"
          }
        }
      }
    ]
  };

  beforeEach(() => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse)
    });
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders list of books", async () => {
    const container = document.createElement('div');
    await act(async () => {
      render(<App />, container);
    })
    const title = screen.getByText("good book")
    const author = screen.getByText("good author")
    expect(title.textContent).toBe("good book")
    expect(author.textContent).toBe("good author")
  });
})