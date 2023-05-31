const {
    fetch,
    fetchAsTestUser,
    fetchAsAdmin,
  } = process;
  
describe('POST /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders', { method: 'POST' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 400 when bad props', () => (
    fetchAsTestUser('/orders', { method: 'POST', body: {} })
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when empty items', () => (
    fetchAsTestUser('/orders', {
      method: 'POST',
      body: { products: [] },
    })
      .then((resp) => {
        expect(resp.status).toBe(400);
      })
  ));

  it('should create order as user (own order)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 10 },
      }),
      fetchAsTestUser('/users/mariana@chef.com'),
      ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);

        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 5, client: 'client' }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
  ));
  
    it('should create order as admin', () => (
      Promise.all([
        fetchAsAdmin('/products', {
          method: 'POST',
          body: { name: 'Test', price: 25 },
        }),
        fetchAsTestUser('/users/test@test.test'),
      ])
        .then((responses) => {
          expect(responses[0].status).toBe(200);
          return Promise.all([responses[0].json(), responses[1].json()]);
        })
        .then(([user]) => fetchAsAdmin('/orders', {
          method: 'POST',
          body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 25 }], userId: user._id },
        }))
        .then((resp) => {
          expect(resp.status).toBe(200);
          return resp.json();
        })
    ));
});
 
  
describe('GET /orders', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should get orders as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 10 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([user]) => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'POST',
            body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 50 }], userId: user._id },
          }),
          fetchAsAdmin('/orders', {
            method: 'POST',
            body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 25 }], userId: user._id },
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(200);
            expect(responses[1].status).toBe(200);
            return fetchAsTestUser('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
  ));

  it('should get orders as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 10 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([user]) => (
        Promise.all([
          fetchAsTestUser('/orders', {
            method: 'POST',
            body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 50 }], userId: user._id },
          }),
          fetchAsAdmin('/orders', {
            method: 'POST',
            body: { products: [{ productId: '6463d81f70ed23fa69dc3f3c', qty: 25 }], userId: user._id },
          }),
        ])
          .then((responses) => {
            expect(responses[0].status).toBe(200);
            expect(responses[1].status).toBe(200);
            return fetchAsAdmin('/orders');
          })
          .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
          })
      ))
  ));
});

describe('GET /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/xxx')
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when admin and not found', () => (
    fetchAsAdmin('/orders/xxxxxxxxxxxx')
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should get order as user', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 99 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
  ));

  it('should get order as admin', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 10 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      
  ));
});

describe('PATCH /orders/:orderId', () => {
  it('should fail with 401 when no auth', () => (
    fetch('/orders/xxx', { method: 'PATCH' })
      .then((resp) => expect(resp.status).toBe(401))
  ));

  it('should fail with 404 when not found', () => (
    fetchAsAdmin('/orders/kkkkkkkkkkkk', {
      method: 'PATCH',
      body: { state: 'canceled' },
    })
      .then((resp) => expect(resp.status).toBe(404))
  ));

  it('should fail with 400 when bad props', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsTestUser(`/orders/${json._id}`))
      .then((resp) => resp.json())
      .then((json) => fetchAsAdmin(`/orders/${json._id}`, { method: 'PATCH' }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should fail with 400 when bad status', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => fetchAsAdmin(`/orders/${json._id}`, {
        method: 'PATCH',
        body: { status: 'oh yeah!' },
      }))
      .then((resp) => expect(resp.status).toBe(400))
  ));

  it('should update order (set status to preparing)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PATCH',
          body: { status: 'preparing' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.status).toBe('preparing'))
  ));

  it('should update order (set status to delivering)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PATCH',
          body: { status: 'delivering' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => expect(json.status).toBe('delivering'))
  ));

  it('should update order (set status to delivered)', () => (
    Promise.all([
      fetchAsAdmin('/products', {
        method: 'POST',
        body: { name: 'Test', price: 66 },
      }),
      fetchAsTestUser('/users/test@test.test'),
    ])
      .then((responses) => {
        expect(responses[0].status).toBe(200);
        expect(responses[1].status).toBe(200);
        return Promise.all([responses[0].json(), responses[1].json()]);
      })
      .then(([product, user]) => fetchAsTestUser('/orders', {
        method: 'POST',
        body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
      }))
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('pending');
        return fetchAsAdmin(`/orders/${json._id}`, {
          method: 'PATCH',
          body: { status: 'delivered' },
        });
      })
      .then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      })
      .then((json) => {
        expect(json.status).toBe('delivered');
        expect(typeof json.dateProcessed).toBe('string');
      })
  ));
});
  
  // describe('DELETE /orders/:orderId', () => {
  //   it('should fail with 401 when no auth', () => (
  //     fetch('/orders/xxx', { method: 'DELETE' })
  //       .then((resp) => expect(resp.status).toBe(401))
  //   ));
  
  //   it('should fail with 404 when not found', () => (
  //     fetchAsAdmin('/orders/xxx', { method: 'DELETE' })
  //       .then((resp) => expect(resp.status).toBe(404))
  //   ));
  
  //   it('should delete other order as admin', () => (
  //     Promise.all([
  //       fetchAsAdmin('/products', {
  //         method: 'POST',
  //         body: { name: 'Test', price: 25 },
  //       }),
  //       fetchAsTestUser('/users/test@test.test'),
  //     ])
  //       .then((responses) => {
  //         expect(responses[0].status).toBe(200);
  //         expect(responses[1].status).toBe(200);
  //         return Promise.all([responses[0].json(), responses[1].json()]);
  //       })
  //       .then(([product, user]) => fetchAsTestUser('/orders', {
  //         method: 'POST',
  //         body: { products: [{ productId: product._id, qty: 5 }], userId: user._id },
  //       }))
  //       .then((resp) => {
  //         expect(resp.status).toBe(200);
  //         return resp.json();
  //       })
  //       .then(
  //         ({ _id }) => fetchAsAdmin(`/orders/${_id}`, { method: 'DELETE' })
  //           .then((resp) => ({ resp, _id })),
  //       )
  //       .then(({ resp, _id }) => {
  //         expect(resp.status).toBe(200);
  //         return fetchAsAdmin(`/orders/${_id}`);
  //       })
  //       .then((resp) => expect(resp.status).toBe(404))
  //   ));
  // });