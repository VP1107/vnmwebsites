import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Three.js animated gradient mesh background for Hero section
 * Features: Wave distortion, cyberpunk gradient, mouse interaction
 */
const GradientMesh = ({ mouse }) => {
    const meshRef = useRef();
    const timeRef = useRef(0);

    // Custom shader uniforms
    const uniforms = useMemo(
        () => ({
            time: { value: 0 },
            mouse: { value: new THREE.Vector2(0, 0) },
        }),
        []
    );

    // Vertex Shader - Creates wave distortion
    const vertexShader = `
    uniform float time;
    uniform vec2 mouse;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      float elevation = sin(pos.x * 2.0 + time) * 0.5;
      elevation += sin(pos.y * 3.0 + time * 0.5) * 0.3;
      elevation += sin((pos.x + pos.y) * 1.5 + time * 0.7) * 0.4;
      
      // Mouse interaction
      float distanceToMouse = distance(vec2(pos.x, pos.y), mouse);
      elevation += smoothstep(5.0, 0.0, distanceToMouse) * 1.5;
      
      pos.z = elevation;
      vElevation = elevation;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    // Fragment Shader - Cyberpunk gradient colors
    const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      // Cyberpunk gradient colors
      vec3 color1 = vec3(0.0, 1.0, 0.53); // #00ff88 (green)
      vec3 color2 = vec3(0.0, 0.83, 1.0);  // #00d4ff (cyan)
      vec3 color3 = vec3(1.0, 0.0, 0.5);   // #ff0080 (pink)
      
      // Mix colors based on UV and elevation
      vec3 color = mix(color1, color2, vUv.x);
      color = mix(color, color3, vUv.y);
      
      // Add pulsing effect
      float pulse = sin(time * 0.5) * 0.5 + 0.5;
      color += vec3(pulse * 0.1);
      
      // Elevation-based glow
      float glow = smoothstep(0.0, 1.0, vElevation + 0.5);
      color += glow * 0.3;
      
      gl_FragColor = vec4(color, 0.3); // Semi-transparent
    }
  `;

    // Update time uniform on each frame
    useFrame((state) => {
        if (!meshRef.current) return;

        timeRef.current += 0.01;
        meshRef.current.material.uniforms.time.value = timeRef.current;

        // Update mouse uniform (normalized to -5 to 5 range)
        if (mouse) {
            const x = (mouse.x / window.innerWidth) * 10 - 5;
            const y = -(mouse.y / window.innerHeight) * 10 + 5;
            meshRef.current.material.uniforms.mouse.value.set(x, y);
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]}>
            <planeGeometry args={[20, 20, 50, 50]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                wireframe={false}
            />
        </mesh>
    );
};

export default GradientMesh;
