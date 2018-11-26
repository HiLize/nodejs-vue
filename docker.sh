!/bin/bash
ACTION=$1
shift
# push to this registry
export DOCKER_REGISTRY=$1
shift

export PROFILE=$1
shift

export PROJECT_NAME="wec-micro-knowledge-competition"
# export PROJECT_WAR_PATH="wec-user-mngt-web/target/wec-user-mngt.war"
export IMAGE_CENTER=
case $ACTION in
    "bp")
        image=${DOCKER_REGISTRY}/${PROJECT_NAME}:${CI_BUILD_TAG}_${CI_BUILD_REF}
        echo building and pushing $image
        # docker build --build-arg PROJECT_WAR_PATH=${PROJECT_WAR_PATH} --build-arg PROFILE=${PROFILE} -t $image .
        docker build --build-arg PROFILE=${PROFILE} -t $image .
        docker push $image

             # if [  -z "$IMAGE_CENTER" ]; then
             #    echo "IMAGE_CENTER is not set"
             # else
             #    curl -d "image=$image&context=$CONTEXT" ${IMAGE_CENTER}
             # fi
        ;;
esac


#ACTION=$1
#shift
#
#export DOCKER_REGISTRY=$1
#shift
#
#export PROJECT_NAME="wec-user-mngt-provider"
#export PROJECT_TAR_PATH="wec-user-mngt-provider/target/wec-user-mngt-provider-assembly.tar.gz"
#
#case $ACTION in
#"bp")
#     image=${DOCKER_REGISTRY}/${PROJECT_NAME}:${CI_BUILD_TAG}_${CI_BUILD_REF}
#     echo building and pushing $image
#     docker build --build-arg PROJECT_TAR_PATH=${PROJECT_TAR_PATH} -t $image .
#     docker push $image
#     ;;
#esac