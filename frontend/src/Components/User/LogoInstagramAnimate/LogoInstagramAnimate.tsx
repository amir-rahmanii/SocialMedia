import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { Group } from 'three';
import { useLoader } from '@react-three/fiber';

const InstagramLogo = ({ mouseX }: { mouseX: number }) => {
    const meshRef = useRef<Group>(null!);
    const model = useLoader(GLTFLoader, '/three/instagram.glb'); // Ensure the path is correct

    // Create a rotation state
    const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

    // Update rotation based on mouseX
    useEffect(() => {
        const rotationY = (mouseX / window.innerWidth) * Math.PI / 8 - Math.PI / 16; // Limit range to ±10 degrees
        setRotation([rotation[0], rotationY, rotation[2]]);
    }, [mouseX, rotation]);

    // Apply the rotation to the logo
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x = rotation[0];
            meshRef.current.rotation.y = rotation[1];
            meshRef.current.rotation.z = rotation[2];
        }
    });

    return (
        <primitive ref={meshRef} object={model.scene} scale={[1, 1, 1]} /> 
    );
};

const LogoInstagramAnimate: React.FC = () => {
    const [mouseX, setMouseX] = useState(0);

    const handleMouseMove = (event: MouseEvent) => {
        setMouseX(event.clientX);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <Canvas style={{ background: '#868686' }} camera={{ position: [-8, 4, 3], fov: 70 }}> {/* Camera position to view centered model */}
            <ambientLight intensity={0.3} />
            <directionalLight intensity={0.5} position={[2, 5, 2]} />
            <InstagramLogo mouseX={mouseX} />
        </Canvas>
    );
};

export default LogoInstagramAnimate;
