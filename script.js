document.getElementById('payBtn').onclick = function () {
  const videoCount = document.getElementById('videoCount').value;

  fetch('/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: videoCount * 100 }) // ₹1 per video
  })
    .then(res => res.json())
    .then(order => {
      const options = {
        key: "rzp_test_mXVIiQX7HTf7nd",
        amount: order.amount,
        currency: "INR",
        name: "LaughMore",
        description: "Video Unlock Access",
        order_id: order.id,
        handler: function (response) {
          // Get associated video from server using order_id
          fetch(`/get-video?order_id=${order.id}`)
            .then(res => res.json())
            .then(data => {
              window.location.href = `/video.html?file=${data.video}`;
            })
            .catch(err => {
              console.error("Video fetch failed", err);
              alert("Payment successful, but failed to load video.");
            });
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    })
    .catch(err => {
      console.error("Payment init failed", err);
      alert("Something went wrong. Please try again.");
    });
};

