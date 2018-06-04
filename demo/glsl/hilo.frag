#define HILO_MAX_PRECISION highp
#define HILO_MAX_VERTEX_PRECISION highp
#define HILO_MAX_FRAGMENT_PRECISION highp
#define HILO_LIGHT_TYPE_NONE 1
#define HILO_SIDE 1028
#define HILO_RECEIVE_SHADOWS 1
#define HILO_CAST_SHADOWS 1
#define HILO_DIFFUSE_MAP 0
#define HILO_HAS_TEXCOORD0 1
#define GLSLIFY 1
#define GLSLIFY 1
#define HILO_FRONT_SIDE 1028
#define HILO_BACK_SIDE 1029
#define HILO_FRONT_AND_BACK_SIDE 1032
#define HILO_PI 3.141592653589793
#define HILO_INVERSE_PI 0.3183098861837907
#ifdef GL_ES
    precision HILO_MAX_FRAGMENT_PRECISION float;
    #define GLSLIFY 1
#endif

#define GLSLIFY 1
#ifdef HILO_HAS_COLOR
    varying vec4 v_color;
#endif

#ifdef HILO_USE_HDR
    uniform float u_exposure;
#endif

#if defined (HILO_GAMMA_INPUT ) || defined(HILO_GAMMA_OUTPUT)
    uniform float u_gammaFactor;
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_TEXCOORD0
    varying vec2 v_texcoord0;
#endif

#ifdef HILO_HAS_TEXCOORD1
    varying vec2 v_texcoord1;
#endif

#ifdef HILO_GAMMA_INPUT
    vec4 invertGammaFactor = vec4(1.0/u_gammaFactor);
#endif

#if defined(HILO_HAS_TEXCOORD0) || defined(HILO_HAS_TEXCOORD1)
    #if defined(HILO_HAS_TEXCOORD0) && defined(HILO_HAS_TEXCOORD1)
        #define HILO_TEXTURE_2D(hiloSampler2D)  hiloTexture2D(hiloSampler2D.texture, hiloSampler2D.uv)
        
        struct hiloSampler2D {
            sampler2D texture;
            int uv;
        };
        #ifdef HILO_GAMMA_INPUT
            vec4 hiloTexture2D(sampler2D texture, int uv) {
                vec4 color;
                if(uv == 0) {
                    color = texture2D(texture, v_texcoord0);
                }
                else {
                    color = texture2D(texture, v_texcoord1);
                }
                return pow(color, invertGammaFactor);
            }
        #else
            vec4 hiloTexture2D(sampler2D texture, int uv) {
                if(uv == 0) {
                    return texture2D(texture, v_texcoord0);
                }
                else {
                    return texture2D(texture, v_texcoord1);
                }
            
            }
        #endif
    #else
        #ifdef HILO_HAS_TEXCOORD1
            #define HILO_V_TEXCOORD v_texcoord1
        #else
            #define HILO_V_TEXCOORD v_texcoord0
        #endif
        #define HILO_TEXTURE_2D(hiloSampler2D)  hiloTexture2D(hiloSampler2D.texture)
        
        struct hiloSampler2D {
            sampler2D texture;
        };
        #ifdef HILO_GAMMA_INPUT
            vec4 hiloTexture2D(sampler2D texture) {
                return pow(texture2D(texture, HILO_V_TEXCOORD), invertGammaFactor);
            }
        #else
            vec4 hiloTexture2D(sampler2D texture) {
                return texture2D(texture, HILO_V_TEXCOORD);
            }
        #endif
    #endif
#endif


#ifdef HILO_DIFFUSE_CUBE_MAP
    varying vec3 v_position;
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_NORMAL
    varying vec3 v_normal;
    #ifdef HILO_NORMAL_MAP
        uniform hiloSampler2D u_normalMap;
        varying mat3 v_TBN;
        #ifdef HILO_NORMAL_MAP_SCALE
            uniform vec3 u_normalMapScale;
        #endif
    #endif
#endif
#define GLSLIFY 1
#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS)
    varying vec3 v_fragPos;
#endif
#define GLSLIFY 1
#if defined(HILO_DIFFUSE_MAP)
    uniform hiloSampler2D u_diffuse;
    #elif defined(HILO_DIFFUSE_CUBE_MAP)
    uniform samplerCube u_diffuse;
#else
    uniform vec4 u_diffuse;
#endif
#define GLSLIFY 1
#ifdef HILO_DIRECTIONAL_LIGHTS
    uniform vec3 u_directionalLightsColor[HILO_DIRECTIONAL_LIGHTS];
    uniform vec3 u_directionalLightsInfo[HILO_DIRECTIONAL_LIGHTS];
    #ifdef HILO_DIRECTIONAL_LIGHTS_SMC
        uniform sampler2D u_directionalLightsShadowMap[HILO_DIRECTIONAL_LIGHTS_SMC];
        uniform vec2 u_directionalLightsShadowMapSize[HILO_DIRECTIONAL_LIGHTS_SMC];
        uniform mat4 u_directionalLightSpaceMatrix[HILO_DIRECTIONAL_LIGHTS_SMC];
        uniform vec2 u_directionalLightsShadowBias[HILO_DIRECTIONAL_LIGHTS_SMC];
    #endif
#endif

#ifdef HILO_SPOT_LIGHTS
    uniform vec3 u_spotLightsPos[HILO_SPOT_LIGHTS];
    uniform vec3 u_spotLightsDir[HILO_SPOT_LIGHTS];
    uniform vec3 u_spotLightsColor[HILO_SPOT_LIGHTS];
    uniform vec2 u_spotLightsCutoffs[HILO_SPOT_LIGHTS];
    uniform vec3 u_spotLightsInfo[HILO_SPOT_LIGHTS];
    #ifdef HILO_SPOT_LIGHTS_SMC
        uniform sampler2D u_spotLightsShadowMap[HILO_SPOT_LIGHTS_SMC];
        uniform vec2 u_spotLightsShadowMapSize[HILO_SPOT_LIGHTS_SMC];
        uniform mat4 u_spotLightSpaceMatrix[HILO_SPOT_LIGHTS_SMC];
        uniform vec2 u_spotLightsShadowBias[HILO_SPOT_LIGHTS_SMC];
    #endif
#endif

#ifdef HILO_POINT_LIGHTS
    uniform vec3 u_pointLightsPos[HILO_POINT_LIGHTS];
    uniform vec3 u_pointLightsColor[HILO_POINT_LIGHTS];
    uniform vec3 u_pointLightsInfo[HILO_POINT_LIGHTS];
    #ifdef HILO_POINT_LIGHTS_SMC
        uniform samplerCube u_pointLightsShadowMap[HILO_POINT_LIGHTS_SMC];
        uniform mat4 u_pointLightSpaceMatrix[HILO_POINT_LIGHTS_SMC];
        uniform vec2 u_pointLightsShadowBias[HILO_POINT_LIGHTS_SMC];
    #endif
#endif

#ifdef HILO_AMBIENT_LIGHTS
    uniform vec3 u_ambientLightsColor;
#endif

#define GLSLIFY 1
float getDiffuse(vec3 normal, vec3 lightDir) {
    return max(dot(normal, lightDir), 0.0);
}
#define GLSLIFY 1
float getSpecular(vec3 cameraPos, vec3 fragPos, vec3 lightDir, vec3 normal, float shininess) {
    vec3 viewDir = normalize(cameraPos - fragPos);
    #ifdef LIGHT_TYPE_PHONG
        return pow(max(dot(viewDir, reflect(-lightDir, normal), 0.0), shininess);
    #else
        return pow(max(dot(normal, normalize(lightDir + viewDir)), 0.0), shininess);
    #endif
}
#define GLSLIFY 1
float getPointAttenuation(vec3 distanceVec, vec3 info) {
    float distance = length(distanceVec);
    return 1.0/(info.x + info.y * distance + info.z * distance * distance);
}
#define GLSLIFY 1
bool isOutOfRange(vec2 pos) {
    if (pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0) {
        return true;
    }
    return false;
}
float getShadow(sampler2D shadowMap, vec2 shadowMapSize, float bias, vec3 fragPos, mat4 lightSpaceMatrix) {
    vec4 fragPosLightSpace = lightSpaceMatrix * vec4(fragPos, 1.0);
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;
    if (isOutOfRange(projCoords.xy)) {
        return 1.0;
    }
    float currentDepth = projCoords.z;
    float shadow = 0.0;
    vec2 texelSize = 1.0 / shadowMapSize;
    for (int x = -1; x <= 1; ++x) {
        for (int y = -1; y <= 1; ++y) {
            vec2 pos = projCoords.xy + vec2(x, y) * texelSize;
            if (isOutOfRange(pos)) {
                shadow += 1.0;
            }
            else {
                float pcfDepth = texture2D(shadowMap, pos).r;
                shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;
            }

        }

    }
    return 1.0 - shadow / 9.0;
}
float getShadow(samplerCube shadowMap, float bias, vec3 distanceVec, mat4 lightSpaceMatrix) {
    float currentDistance = length(distanceVec);
    vec3 direction = normalize(( lightSpaceMatrix * vec4(-distanceVec, 1.0) ).xyz);
    float shadow = 0.0;
    const float samples = 2.0;
    const float offset = 0.01;
    const float step = offset / (samples * 0.5);
    for(float x = -offset; x < offset; x += step) {
        for(float y = -offset; y < offset; y += step) {
            for(float z = -offset; z < offset; z += step) {
                float closestDistance = textureCube(shadowMap, direction + vec3(x, y, z)).r;
                if(currentDistance - bias > closestDistance)
                shadow += 1.0;
            }

        }

    }
    shadow /= (samples * samples * samples);
    return 1.0 - shadow;
}
#define GLSLIFY 1
#define GLSLIFY 1
#ifdef HILO_GAMMA_INPUT
    vec4 textureEnvMap(sampler2D texture, vec3 position) {
        vec2 newPosition = vec2(atan(position.x, position.z) * HILO_INVERSE_PI * 0.5+0.5, acos(position.y) * HILO_INVERSE_PI);
        return pow(texture2D(texture, newPosition), invertGammaFactor);
    }
    vec4 textureEnvMap(samplerCube texture, vec3 position) {
        return pow(textureCube(texture, position), invertGammaFactor);
    }
#else
    vec4 textureEnvMap(sampler2D texture, vec3 position) {
        return texture2D(texture, vec2(atan(position.x, position.z) * HILO_INVERSE_PI * 0.5+0.5, acos(position.y) * HILO_INVERSE_PI));
    }
    vec4 textureEnvMap(samplerCube texture, vec3 position) {
        return textureCube(texture, position);
    }
#endif



#ifdef HILO_HAS_LIGHT
    #ifdef HILO_HAS_SPECULAR
        uniform float u_shininess;
        #ifdef HILO_SPECULAR_MAP
            uniform hiloSampler2D u_specular;
        #else
            uniform vec4 u_specular;
        #endif
    #endif
    #ifdef HILO_EMISSION_MAP
        uniform hiloSampler2D u_emission;
    #else
        uniform vec4 u_emission;
    #endif
    #ifdef HILO_AMBIENT_MAP
        uniform hiloSampler2D u_ambient;
    #endif
    #ifdef HILO_SPECULAR_ENV_MAP
        #ifdef HILO_SPECULAR_ENV_MAP_CUBE
            uniform samplerCube u_specularEnvMap;
        #else
            uniform sampler2D u_specularEnvMap;
        #endif
        uniform mat4 u_specularEnvMatrix;
        uniform float u_reflectivity;
        uniform float u_refractRatio;
        uniform float u_refractivity;
    #endif
#endif
#define GLSLIFY 1
#ifdef HILO_TRANSPARENCY_MAP
    uniform hiloSampler2D u_transparency;
#else
    uniform float u_transparency;
#endif

#ifdef HILO_ALPHA_CUTOFF
    uniform float u_alphaCutoff;
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_FOG
    varying float v_dist;
    uniform vec4 u_fogColor;
    #ifdef HILO_FOG_LINEAR
        uniform vec2 u_fogInfo;
    #else
        uniform float u_fogInfo;
    #endif
#endif

void main(void) {
    vec4 diffuse = vec4(0., 0., 0., 1.);
    vec4 color = vec4(0., 0., 0., 1.);
    #define GLSLIFY 1
    #ifdef HILO_NORMAL_MAP
        vec3 normal = HILO_TEXTURE_2D(u_normalMap).rgb * 2.0 - 1.0;
        #ifdef HILO_NORMAL_MAP_SCALE
            normal = normal * u_normalMapScale;
        #endif
        normal = normalize(v_TBN * normal);
        #elif defined(HILO_HAS_NORMAL)
        vec3 normal = normalize(v_normal);
    #else
        vec3 normal = vec3(0, 0, 1);
    #endif
    
    #if HILO_SIDE == HILO_BACK_SIDE
        normal = -normal;
    #endif
    #define GLSLIFY 1
    #ifdef HILO_HAS_LIGHT
        #if HILO_SIDE == HILO_FRONT_AND_BACK_SIDE
            if(dot(-v_fragPos, normal) < 0.0) {
                normal = -normal;
            }
        #endif
    #endif
    #define GLSLIFY 1
    #if defined(HILO_DIFFUSE_MAP)
        diffuse = HILO_TEXTURE_2D(u_diffuse);
        #elif defined(HILO_DIFFUSE_CUBE_MAP)
        diffuse = textureCube(u_diffuse, v_position);
        #elif defined(HILO_HAS_COLOR)
        diffuse = v_color;
    #else
        diffuse = u_diffuse;
    #endif
    color.a = diffuse.a;
    #define GLSLIFY 1
    #ifdef HILO_HAS_LIGHT
        vec3 lightDiffuse = vec3(0, 0, 0);
        vec3 lightAmbient = vec3(0, 0, 0);
        vec3 viewPos = vec3(0, 0, 0);
        #ifdef HILO_AMBIENT_MAP
            lightAmbient = HILO_TEXTURE_2D(u_ambient).rgb;
        #else
            lightAmbient = diffuse.rgb;
        #endif
        
        #ifdef HILO_HAS_SPECULAR
            vec3 lightSpecular = vec3(0, 0, 0);
            #ifdef HILO_SPECULAR_MAP
                vec4 specular = HILO_TEXTURE_2D(u_specular);
            #else
                vec4 specular = u_specular;
            #endif
        #endif
        
        #ifdef HILO_EMISSION_MAP
            vec4 emission = HILO_TEXTURE_2D(u_emission);
        #else
            vec4 emission = u_emission;
        #endif
        
        #ifdef HILO_DIRECTIONAL_LIGHTS
            for(int i = 0;i < HILO_DIRECTIONAL_LIGHTS;i++) {
                vec3 lightDir = -u_directionalLightsInfo[i];
                float shadow = 1.0;
                #ifdef HILO_DIRECTIONAL_LIGHTS_SMC
                    if (i < HILO_DIRECTIONAL_LIGHTS_SMC) {
                        float bias = max(u_directionalLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_directionalLightsShadowBias[i][0]);
                        shadow = getShadow(u_directionalLightsShadowMap[i], u_directionalLightsShadowMapSize[i], bias, v_fragPos, u_directionalLightSpaceMatrix[i]);
                    }
                #endif
                
                float diff = getDiffuse(normal, lightDir);
                lightDiffuse += diff * u_directionalLightsColor[i] * shadow;
                #ifdef HILO_HAS_SPECULAR
                    float spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);
                    lightSpecular += spec * u_directionalLightsColor[i] * shadow;
                #endif
            }
        #endif
        
        #ifdef HILO_SPOT_LIGHTS
            for(int i = 0; i < HILO_SPOT_LIGHTS; i++) {
                vec3 lightDir = -u_spotLightsDir[i];
                vec3 distanceVec = u_spotLightsPos[i] - v_fragPos;
                float shadow = 1.0;
                #ifdef HILO_SPOT_LIGHTS_SMC
                    if (i < HILO_SPOT_LIGHTS_SMC) {
                        float bias = max(u_spotLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_spotLightsShadowBias[i][0]);
                        shadow = getShadow(u_spotLightsShadowMap[i], u_spotLightsShadowMapSize[i], bias, v_fragPos, u_spotLightSpaceMatrix[i]);
                    }
                #endif
                
                float diff = getDiffuse(normal, normalize(distanceVec));
                float theta = dot(normalize(distanceVec), lightDir);
                float epsilon = u_spotLightsCutoffs[i][0] - u_spotLightsCutoffs[i][1];
                float intensity = clamp((theta - u_spotLightsCutoffs[i][1]) / epsilon, 0.0, 1.0);
                float attenuation = getPointAttenuation(distanceVec, u_spotLightsInfo[i]);
                lightDiffuse += intensity * attenuation * shadow * diff * u_spotLightsColor[i];
                #ifdef HILO_HAS_SPECULAR
                    float spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);
                    lightSpecular += intensity * attenuation * shadow * spec * u_spotLightsColor[i];
                #endif
            }
        #endif
        
        #ifdef HILO_POINT_LIGHTS
            for(int i = 0;i < HILO_POINT_LIGHTS;i++) {
                vec3 distanceVec = u_pointLightsPos[i] - v_fragPos;
                vec3 lightDir = normalize(distanceVec);
                float shadow = 1.0;
                #ifdef HILO_POINT_LIGHTS_SMC
                    if (i < HILO_POINT_LIGHTS_SMC) {
                        float bias = max(u_pointLightsShadowBias[i][1] * (1.0 - dot(normal, lightDir)), u_pointLightsShadowBias[i][0]);
                        shadow = getShadow(u_pointLightsShadowMap[i], bias, distanceVec, u_pointLightSpaceMatrix[i]);
                    }
                #endif
                
                float diff = getDiffuse(normal, lightDir);
                float attenuation = getPointAttenuation(distanceVec, u_pointLightsInfo[i]);
                lightDiffuse += diff * attenuation * u_pointLightsColor[i] * shadow;
                #ifdef HILO_HAS_SPECULAR
                    float spec = getSpecular(viewPos, v_fragPos, lightDir, normal, u_shininess);
                    lightSpecular += spec * attenuation * u_pointLightsColor[i] * shadow;
                #endif
            }
        #endif
        
        #ifdef HILO_AMBIENT_LIGHTS
            color.rgb += u_ambientLightsColor * lightAmbient;
        #endif
        
        #if defined(HILO_SPECULAR_ENV_MAP) && defined(HILO_HAS_SPECULAR)
            vec3 I = normalize(v_fragPos - viewPos);
            if (u_reflectivity > 0.0) {
                vec3 R = reflect(I, normal);
                R = normalize(vec3(u_specularEnvMatrix * vec4(R, 1.0)));
                lightSpecular += textureEnvMap(u_specularEnvMap, R).rgb * u_reflectivity;
            }
            if (u_refractivity > 0.0) {
                vec3 R = refract(I, normal, u_refractRatio);
                R = normalize(vec3(u_specularEnvMatrix * vec4(R, 1.0)));
                lightSpecular += textureEnvMap(u_specularEnvMap, R).rgb * u_refractivity;
            }
        #endif
        
        color.rgb += lightDiffuse * diffuse.rgb;
        #ifdef HILO_HAS_SPECULAR
            color.rgb += lightSpecular * specular.rgb;
        #endif
        
        color.rgb += emission.rgb;
    #else
        color = diffuse;
    #endif
    #define GLSLIFY 1
    float transparency = 1.0;
    #ifdef HILO_TRANSPARENCY_MAP
        transparency = HILO_TEXTURE_2D(u_transparency).r;
    #else
        transparency = u_transparency;
    #endif
    color.a *= transparency;
    #ifdef HILO_ALPHA_CUTOFF
        if (color.a < u_alphaCutoff) {
            discard;
        }
        else {
            color.a = 1.0;
        }
    #endif
    #define GLSLIFY 1
    #ifdef HILO_HAS_FOG
        float fogFactor = 1.0;
        #ifdef HILO_FOG_LINEAR
            fogFactor = (u_fogInfo.y - v_dist)/(u_fogInfo.y - u_fogInfo.x);
            #elif defined(HILO_FOG_EXP)
            fogFactor = exp(-abs(u_fogInfo * v_dist));
            #elif defined(HILO_FOG_EXP2)
            fogFactor = exp(-(u_fogInfo * v_dist) * (u_fogInfo * v_dist));
        #endif
        
        fogFactor = clamp(fogFactor, 0.0, 1.0);
        color = mix(u_fogColor, color, fogFactor);
    #endif
    #define GLSLIFY 1
    #ifdef HILO_IGNORE_TRANSPARENT
        color.a = 1.0;
    #endif
    
    color.rgb *= color.a;
    #ifdef HILO_GAMMA_OUTPUT
        color.rgb = pow(color.rgb, vec3(u_gammaFactor));
    #endif
    
    #ifdef HILO_USE_HDR
        color.rgb = vec3(1.0) - exp(-color.rgb * u_exposure);
    #endif
    
    gl_FragColor = color;
}