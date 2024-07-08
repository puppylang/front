import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BlockerForm, ReportForm } from '@/types/report';
import { UserType } from '@/types/user';
import { fetcherStatusWithToken } from '@/utils/request';

import { USER_QUERY_KEY } from './user';

const REPORT_QUERY_KEY = '/report';
const BLOCKER_QUERY_KEY = '/block';

export const createReport = (data: ReportForm) => {
  const { title, detail, reportedId, reporterId } = data;

  return fetcherStatusWithToken(REPORT_QUERY_KEY, {
    method: 'POST',
    data: {
      title,
      detail,
      reported_id: reportedId,
      reporter_id: reporterId,
    },
  });
};

export const createBlock = (data: BlockerForm) => {
  const { blockedId, blockerId } = data;

  return fetcherStatusWithToken(BLOCKER_QUERY_KEY, {
    method: 'POST',
    data: {
      blocked_id: blockedId,
      blocker_id: blockerId,
    },
  });
};

export const cancelBlock = (data: BlockerForm) => {
  const { blockedId, blockerId } = data;

  return fetcherStatusWithToken(BLOCKER_QUERY_KEY, {
    method: 'DELETE',
    data: {
      blocked_id: blockedId,
      blocker_id: blockerId,
    },
  });
};

export const useCreateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOCKER_QUERY_KEY],
    mutationFn: (data: BlockerForm) => createBlock(data),
    onSuccess: (_, variable) => {
      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return {
          ...oldData,
          blocker: [
            ...oldData.blocker,
            { blocked_id: variable.blockedId, blocker_id: variable.blockerId, created_at: '' },
          ],
        };
      });
    },
  });
};

export const useCancelBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [BLOCKER_QUERY_KEY],
    mutationFn: (data: BlockerForm) => cancelBlock(data),
    onSuccess: (_, variable) => {
      queryClient.setQueryData([USER_QUERY_KEY], (oldData: UserType) => {
        return {
          ...oldData,
          blocker: oldData.blocker.filter(blockedUser => blockedUser.blocked_id !== variable.blockedId),
        };
      });
    },
  });
};
