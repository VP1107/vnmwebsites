// LoadingFallback.jsx (FIXED)
// ✅ Removed unused React import
// ✅ Changed to minimal height to prevent layout shift

const LoadingFallback = () => (
    <div style={{
        height: '100px', // ✅ Minimal height instead of 100vh
        background: 'transparent', // ✅ Transparent instead of black
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    }}>
        <div style={{
            width: '30px', // ✅ Smaller spinner
            height: '30px',
            border: '2px solid rgba(56, 189, 248, 0.2)',
            borderTop: '2px solid #38bdf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }} />
        <style>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
);

export default LoadingFallback;