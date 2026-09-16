import { useEffect, useState } from 'react'
import {
    getJoinedCommunities,
    joinCommunity,
    leaveCommunity,
} from '../api/communities.js'
import { useAuth } from '../context/useAuth.js'

export function useCommunityMemberships() {
    const { user, isLoading: isAuthLoading } = useAuth()

    const [joinedCommunities, setJoinedCommunities] =
        useState([])
    const [joinedStatus, setJoinedStatus] =
        useState('loading')
    const [joinedError, setJoinedError] = useState('')
    const [actionError, setActionError] = useState('')
    const [pendingCommunityId, setPendingCommunityId] =
        useState(null)
    const [requestVersion, setRequestVersion] = useState(0)
    const [loadedUserKey, setLoadedUserKey] = useState(null)

    const currentUserKey =
        user?.id ?? user?.email ?? null

    useEffect(() => {
        if (
            isAuthLoading ||
            !user ||
            !currentUserKey
        ) {
            return undefined
        }

        let active = true

        async function loadMemberships() {
            try {
                const result = await getJoinedCommunities()

                if (!active) {
                    return
                }

                setJoinedCommunities(result)
                setJoinedError('')
                setLoadedUserKey(currentUserKey)
                setJoinedStatus(
                    result.length === 0 ? 'empty' : 'success',
                )
            } catch (error) {
                if (!active) {
                    return
                }

                setJoinedCommunities([])
                setJoinedError(
                    error instanceof Error
                        ? error.message
                        : 'Your joined communities could not be loaded.',
                )
                setLoadedUserKey(currentUserKey)
                setJoinedStatus('error')
            }
        }

        loadMemberships()

        return () => {
            active = false
        }
    }, [
        currentUserKey,
        isAuthLoading,
        requestVersion,
        user,
    ])

    const membershipStateReady =
        !user ||
        (loadedUserKey === currentUserKey &&
            (joinedStatus === 'success' ||
                joinedStatus === 'empty'))

    const isJoined = (communityId) => {
        if (!user || !membershipStateReady) {
            return false
        }

        return joinedCommunities.some(
            (community) => community.id === communityId,
        )
    }

    const join = async (community) => {
        if (
            !user ||
            !membershipStateReady ||
            pendingCommunityId !== null
        ) {
            return false
        }

        setPendingCommunityId(community.id)
        setActionError('')

        try {
            // Wait for the API before changing React state.
            await joinCommunity(community.id)

            setJoinedCommunities((current) => {
                const alreadyJoined = current.some(
                    (joinedCommunity) =>
                        joinedCommunity.id === community.id,
                )

                if (alreadyJoined) {
                    return current
                }

                return [...current, community].sort((left, right) =>
                    left.name.localeCompare(right.name),
                )
            })

            setJoinedStatus('success')

            return true
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'The community could not be joined. Please try again.',
            )

            return false
        } finally {
            setPendingCommunityId(null)
        }
    }

    const leave = async (community) => {
        if (
            !user ||
            !membershipStateReady ||
            pendingCommunityId !== null
        ) {
            return false
        }

        setPendingCommunityId(community.id)
        setActionError('')

        try {
            // Wait for the API before changing React state.
            await leaveCommunity(community.id)

            const remainingCommunities =
                joinedCommunities.filter(
                    (joinedCommunity) =>
                        joinedCommunity.id !== community.id,
                )

            setJoinedCommunities(remainingCommunities)

            setJoinedStatus(
                remainingCommunities.length === 0
                    ? 'empty'
                    : 'success',
            )

            return true
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : 'The community could not be left. Please try again.',
            )

            return false
        } finally {
            setPendingCommunityId(null)
        }
    }

    const retryJoinedCommunities = () => {
        setJoinedError('')
        setJoinedStatus('loading')
        setRequestVersion((current) => current + 1)
    }

    const clearActionError = () => {
        setActionError('')
    }

    return {
        actionError,
        clearActionError,
        isAuthLoading,
        isJoined,
        join,
        joinedCommunities,
        joinedError,
        joinedStatus,
        leave,
        membershipStateReady,
        pendingCommunityId,
        retryJoinedCommunities,
        user,
    }
}